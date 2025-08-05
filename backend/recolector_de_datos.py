# backend/recolector_de_datos.py
import requests
import csv
import time
import os

# --- CONFIGURACIÓN ---
API_KEY     = "3662c82bee725cc73567b4594fa88001"  # Tu API Key de API-Football (api-sports.com)
API_HOST    = "v3.football.api-sports.io"
# Autenticación directa con API-Football:
HEADERS     = {'x-apisports-key': API_KEY}

LEAGUE_ID    = 140     # ID de la liga a recolectar
SEASON       = 2021    # Temporada que deseas extraer
CSV_FILENAME = f"datos_liga_{LEAGUE_ID}_temporada_{SEASON}.csv"

# --- Funciones de obtención ---

def obtener_partidos_de_liga(league_id, season):
    url = f"https://{API_HOST}/fixtures"
    params = {'league': league_id, 'season': season}
    fixtures = []

    # Primera página
    r = requests.get(url, headers=HEADERS, params=params)
    r.raise_for_status()
    data = r.json()
    fixtures.extend(data.get('response', []))
    total_pages = data.get('paging', {}).get('total', 1)
    print(f"→ Total fixtures encontrados para {season}: {len(fixtures)} en la primera página (páginas totales: {total_pages})")

    # Descarga páginas siguientes si las hay
    for page in range(2, total_pages + 1):
        params['page'] = page
        time.sleep(1.0)
        r = requests.get(url, headers=HEADERS, params=params)
        r.raise_for_status()
        fixtures.extend(r.json().get('response', []))
        print(f"  → Página {page} descargada, acumulado: {len(fixtures)} fixtures")

    return fixtures


def obtener_estadisticas_partido(fixture_id):
    url = f"https://{API_HOST}/fixtures/statistics"
    time.sleep(1.0)
    r = requests.get(url, headers=HEADERS, params={'fixture': fixture_id})
    # Manejo de límite de peticiones
    if r.status_code == 429:
        print(f"⚠️ 429 para stats de fixture {fixture_id}, se salta.")
        return []
    r.raise_for_status()
    return r.json().get('response', [])

# --- Script principal ---
if __name__ == '__main__':
    # Prepara control de duplicados si ya existe CSV
    procesados = set()
    if os.path.exists(CSV_FILENAME):
        with open(CSV_FILENAME, 'r', encoding='utf-8') as f:
            for row in csv.DictReader(f):
                procesados.add(int(row['partido_id']))
        print(f"{len(procesados)} partidos ya en el CSV, se saltarán.")

    # Preparar archivo CSV
    modo = 'a' if procesados else 'w'
    with open(CSV_FILENAME, modo, newline='', encoding='utf-8') as f:
        fieldnames = [
            'partido_id','temporada','local_goles','visitante_goles',
            'tiros_local','tiros_visitante',
            'tiros_apuerta_local','tiros_apuerta_visitante',
            'posesion_local','posesion_visitante',
            'corners_local','corners_visitante'
        ]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        if modo == 'w':
            writer.writeheader()

        # Descarga todos los fixtures de la temporada
        fixtures = obtener_partidos_de_liga(LEAGUE_ID, SEASON)

        nuevos = 0
        for part in fixtures:
            fid = part['fixture']['id']
            if fid in procesados:
                continue

            stats = obtener_estadisticas_partido(fid)
            if len(stats) != 2:
                print(f"⚠️ Sin stats completas para {fid}, se salta.")
                continue

            # Función para extraer valor de estadística
            def get_stat(lista, nombre):
                for s in lista:
                    if s['type'] == nombre:
                        v = s['value'] or 0
                        return int(v.rstrip('%')) if isinstance(v, str) else v
                return 0

            home = stats[0]['statistics']
            away = stats[1]['statistics']
            fila = {
                'partido_id': fid,
                'temporada': SEASON,
                'local_goles': part['goals']['home'],
                'visitante_goles': part['goals']['away'],
                'tiros_local': get_stat(home, 'Total Shots'),
                'tiros_visitante': get_stat(away, 'Total Shots'),
                'tiros_apuerta_local': get_stat(home, 'Shots on Goal'),
                'tiros_apuerta_visitante': get_stat(away, 'Shots on Goal'),
                'posesion_local': get_stat(home, 'Ball Possession'),
                'posesion_visitante': get_stat(away, 'Ball Possession'),
                'corners_local': get_stat(home, 'Corner Kicks'),
                'corners_visitante': get_stat(away, 'Corner Kicks'),
            }
            writer.writerow(fila)
            procesados.add(fid)
            nuevos += 1

        print(f"\n✅ Escritura completada: {nuevos} partidos añadidos.")
        print(f"Total en CSV ahora: {len(procesados)}")
