from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# Clave API de Football-Data.org
API_KEY = '15ae401df83148a68c7f6ed23b27c73b'
BASE_URL = 'http://api.football-data.org/v4'

# Mapa de nombres de equipos a IDs
TEAM_IDS = {
    'Real Madrid CF': 86,
    'Barcelona': 81,
    'Girona FC': 298,
    'Club Atlético de Madrid': 78,
    'Athletic Club': 77,
    'Real Sociedad': 92,
    'Real Betis': 90,
    'Villarreal': 94,
    'Valencia': 95,
    'Deportivo Alavés': 263,
    'Getafe': 82,
    'CA Osasuna': 79,
    'RC Celta de Vigo': 558,
    'Sevilla FC': 85,
    'Mallorca': 84,
    'UD Las Palmas': 275,
    'Rayo Vallecano': 87,
    'Cádiz CF': 264,
    'UD Almería': 267,
    'Granada CF': 83
}

@app.route('/api/team-stats/<team_name>', methods=['GET'])
def team_stats(team_name):
    print(f"Received team_name: {team_name}")
    team_id = TEAM_IDS.get(team_name)
    if not team_id:
        print(f"Error: Team '{team_name}' not found in TEAM_IDS")
        return jsonify({'error': 'Equipo no encontrado'}), 404

    headers = {'X-Auth-Token': API_KEY}
    try:
        response = requests.get(
            f'{BASE_URL}/competitions/2014/standings?season=2023',  # Cambiado a 2023
            headers=headers
        )
        print(f"API Response Status for {team_name}: {response.status_code}")
        print(f"API Response Data: {response.json()}")
        if response.status_code != 200:
            return jsonify({'error': f'Error al obtener datos de la API (código {response.status_code})'}), 500

        standings = response.json().get('standings', [])[0].get('table', [])
        team_data = next((team for team in standings if team['team']['id'] == team_id), None)
        
        if not team_data:
            print(f"Error: Team ID {team_id} not found in standings")
            return jsonify({'error': 'Equipo no encontrado en la competición'}), 404

        stats = {
            'name': team_name,
            'matchesPlayed': team_data['playedGames'],
            'wins': team_data['won'],
            'draws': team_data['draw'],
            'losses': team_data['lost'],
            'goalsFor': team_data['goalsFor'],
            'goalsAgainst': team_data['goalsAgainst']
        }
        print(f"Returning stats for {team_name}: {stats}")
        return jsonify(stats)
    except Exception as e:
        print(f"Exception for {team_name}: {str(e)}")
        return jsonify({'error': f'Error al procesar la solicitud: {str(e)}'}), 500

@app.route('/api/league-stats/<league_name>', methods=['GET'])
def league_stats(league_name):
    if league_name != 'La Liga':
        return jsonify({'error': 'Solo La Liga está soportada actualmente'}), 400

    headers = {'X-Auth-Token': API_KEY}
    try:
        response = requests.get(
            f'{BASE_URL}/competitions/2014/standings?season=2023',  # Cambiado a 2023
            headers=headers
        )
        print(f"API Response Status for league {league_name}: {response.status_code}")
        print(f"API Response Data: {response.json()}")
        if response.status_code != 200:
            return jsonify({'error': f'Error al obtener datos de la API (código {response.status_code})'}), 500

        standings = response.json().get('standings', [])[0].get('table', [])
        stats = [
            {
                'position': team['position'],
                'team': team['team']['name'],
                'points': team['points'],
                'played': team['playedGames'],
                'wins': team['won'],
                'draws': team['draw'],
                'losses': team['lost']
            }
            for team in standings
        ]
        print(f"Returning league stats for {league_name}: {stats}")
        return jsonify(stats)
    except Exception as e:
        print(f"Exception for league {league_name}: {str(e)}")
        return jsonify({'error': f'Error al procesar la solicitud: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)