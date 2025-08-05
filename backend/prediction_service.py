import requests
import joblib

try:
    modelo_cargado = joblib.load('models/ModeloCuotas.joblib')
except FileNotFoundError:
    modelo_cargado = None
    print("ADVERTENCIA: No se encontró el archivo del modelo 'ModeloCuotas.joblib'")

# Mapeo de nombres de equipos para sincronizar The Odds API y Football-Data.org
TEAM_NAME_MAPPING = {
    'Real Madrid': {'odds_api': 'Real Madrid', 'football_data': 'Real Madrid CF'},
    'FC Barcelona': {'odds_api': 'Barcelona', 'football_data': 'Barcelona'},
    'Atlético Madrid': {'odds_api': 'Atlético Madrid', 'football_data': 'Club Atlético de Madrid'},
    'Sevilla FC': {'odds_api': 'Sevilla', 'football_data': 'Sevilla FC'},
    'Valencia CF': {'odds_api': 'Valencia', 'football_data': 'Valencia'},
    'Villarreal CF': {'odds_api': 'Villarreal', 'football_data': 'Villarreal'},
    'Athletic Club': {'odds_api': 'Athletic Bilbao', 'football_data': 'Athletic Club'},
    'Real Sociedad': {'odds_api': 'Real Sociedad', 'football_data': 'Real Sociedad'},
    'Getafe CF': {'odds_api': 'Getafe', 'football_data': 'Getafe'},
    'RC Celta': {'odds_api': 'Celta Vigo', 'football_data': 'RC Celta de Vigo'},
    'RCD Espanyol': {'odds_api': 'Espanyol', 'football_data': 'Espanyol'},
    'RCD Mallorca': {'odds_api': 'Mallorca', 'football_data': 'Mallorca'},
    'Deportivo Alavés': {'odds_api': 'Alavés', 'football_data': 'Deportivo Alavés'},
    'Rayo Vallecano': {'odds_api': 'Rayo Vallecano', 'football_data': 'Rayo Vallecano'},
    'CA Osasuna': {'odds_api': 'Osasuna', 'football_data': 'CA Osasuna'},
    'Girona FC': {'odds_api': 'Girona', 'football_data': 'Girona FC'},
    'Real Betis': {'odds_api': 'Real Betis', 'football_data': 'Real Betis'},
    'UD Las Palmas': {'odds_api': 'Las Palmas', 'football_data': 'UD Las Palmas'},
    'Cádiz CF': {'odds_api': 'Cádiz', 'football_data': 'Cádiz CF'},
    'UD Almería': {'odds_api': 'Almería', 'football_data': 'UD Almería'},
    'Granada CF': {'odds_api': 'Granada', 'football_data': 'Granada CF'}
}

def get_football_data_stats(team_name):
    """Obtener estadísticas de un equipo desde stats_api.py (Football-Data.org)"""
    try:
        response = requests.get(f'http://localhost:5001/api/team-stats/{team_name}')
        response.raise_for_status()
        print(f"Stats fetched for {team_name}: {response.json()}")
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error al obtener estadísticas de {team_name}: {e}")
        return None

def get_available_matches():
    """Obtener partidos con cuotas disponibles desde The Odds API"""
    API_KEY = 'bb5495a1aa00a0b23a5be322cdd912ab'
    LIGA = 'soccer_spain_la_liga'
    url = f'https://api.the-odds-api.com/v4/sports/{LIGA}/odds/?apiKey={API_KEY}&regions=eu&markets=h2h'
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data_partidos = response.json()
    except requests.exceptions.RequestException as e:
        raise Exception(f"No se pudo conectar a la API de cuotas: {e}")

    matches = []
    print("--- Partidos Encontrados por The Odds API ---")
    for partido in data_partidos:
        home_team = partido['home_team']
        away_team = partido['away_team']
        print(f"Local: {home_team}, Visitante: {away_team}")
        
        # Mapear nombres de equipos a los usados en Football-Data.org
        home_team_mapped = None
        away_team_mapped = None
        for standard_name, names in TEAM_NAME_MAPPING.items():
            if names['odds_api'] == home_team:
                home_team_mapped = names['football_data']
            if names['odds_api'] == away_team:
                away_team_mapped = names['football_data']
        
        print(f"Mapped: {home_team} -> {home_team_mapped}, {away_team} -> {away_team_mapped}")
        if not home_team_mapped or not away_team_mapped:
            print(f"Partido {home_team} vs {away_team} no mapeado, se salta")
            continue

        try:
            cuotas = partido['bookmakers'][0]['markets'][0]['outcomes']
            matches.append({
                'homeTeam': home_team_mapped,
                'awayTeam': away_team_mapped,
                'date': partido['commence_time'],
                'odds': {
                    'homeWin': cuotas[0]['price'],
                    'draw': cuotas[1]['price'],
                    'awayWin': cuotas[2]['price']
                }
            })
        except (IndexError, KeyError):
            print(f"Partido {home_team} vs {away_team} sin cuotas válidas, se salta")
            continue
    print("Returning matches:", matches)
    return matches

def predecir_partido(equipo_local, equipo_visitante):
    if not modelo_cargado:
        return {"error": "El modelo no está cargado."}

    API_KEY = 'bb5495a1aa00a0b23a5be322cdd912ab'
    LIGA = 'soccer_spain_la_liga'
    url = f'https://api.the-odds-api.com/v4/sports/{LIGA}/odds/?apiKey={API_KEY}&regions=eu&markets=h2h'
    
    # Mapear nombres a los de The Odds API y Football-Data.org
    local_odds_api = None
    visitante_odds_api = None
    local_football_data = None
    visitante_football_data = None
    for standard_name, names in TEAM_NAME_MAPPING.items():
        if standard_name == equipo_local:
            local_odds_api = names['odds_api']
            local_football_data = names['football_data']
        if standard_name == equipo_visitante:
            visitante_odds_api = names['odds_api']
            visitante_football_data = names['football_data']
    
    if not local_odds_api or not visitante_odds_api:
        return {"error": f"Equipo {equipo_local} o {equipo_visitante} no encontrado en el mapeo"}

    try:
        response = requests.get(url)
        response.raise_for_status()
        data_partidos = response.json()
    except requests.exceptions.RequestException as e:
        return {"error": f"No se pudo conectar a la API de cuotas: {e}"}

    print("--- Partidos Encontrados por la API ---")
    partido_encontrado = None
    for partido in data_partidos:
        print(f"Local: {partido['home_team']}, Visitante: {partido['away_team']}")
        if partido['home_team'] == local_odds_api and partido['away_team'] == visitante_odds_api:
            partido_encontrado = partido
            break
    print("---------------------------------------")

    if not partido_encontrado:
        return {"error": f"No se encontraron cuotas para el partido {equipo_local} vs {equipo_visitante}"}

    try:
        cuotas = partido_encontrado['bookmakers'][0]['markets'][0]['outcomes']
        cuota_local = cuotas[0]['price']
        cuota_empate = cuotas[1]['price']
        cuota_visitante = cuotas[2]['price']
    except (IndexError, KeyError):
        return {"error": "El formato de las cuotas no es el esperado."}

    # Obtener estadísticas usando nombres de Football-Data.org
    local_stats = get_football_data_stats(local_football_data)
    visitante_stats = get_football_data_stats(visitante_football_data)

    # Características para el modelo (solo las 4 esperadas por el modelo)
    prob_H = 1 / cuota_local
    prob_D = 1 / cuota_empate
    prob_A = 1 / cuota_visitante
    diferencia_prob = prob_H - prob_A

    # Calcular estadísticas para incluir en la respuesta, pero no en la predicción
    local_points = local_stats['points'] if local_stats and 'points' in local_stats else 0
    visitante_points = visitante_stats['points'] if visitante_stats and 'points' in visitante_stats else 0
    local_goal_diff = (local_stats['goalsFor'] - local_stats['goalsAgainst']) if local_stats else 0
    visitante_goal_diff = (visitante_stats['goalsFor'] - visitante_stats['goalsAgainst']) if visitante_stats else 0

    # Usar solo las 4 características esperadas por el modelo
    features = [[prob_H, prob_D, prob_A, diferencia_prob]]
    print(f"Features sent to model: {features}")

    try:
        prediccion_numerica = modelo_cargado.predict(features)[0]
        probabilidades_prediccion = modelo_cargado.predict_proba(features)[0]
        resultado = "Gana Local" if prediccion_numerica == 1 else "No Gana Local"
        confianza = f"{max(probabilidades_prediccion) * 100:.2f}%"
    except Exception as e:
        return {"error": f"Error al realizar la predicción: {str(e)}"}

    return {
        "partido": f"{equipo_local} vs {equipo_visitante}",
        "prediccion": resultado,
        "confianza": confianza,
        "cuotas": {
            "local": cuota_local,
            "empate": cuota_empate,
            "visitante": cuota_visitante
        },
        "stats": {
            "local_points": local_points,
            "visitante_points": visitante_points,
            "local_goal_diff": local_goal_diff,
            "visitante_goal_diff": visitante_goal_diff
        }
    }