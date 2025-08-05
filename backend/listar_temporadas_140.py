# listar_temporadas_liga.py
import requests

API_KEY = "3662c82bee725cc73567b4594fa88001"
API_HOST = "v3.football.api-sports.io"
LEAGUE_ID = 140  # Cambia esto si es otra liga

headers = {
    "x-apisports-key": API_KEY
}

url = f"https://{API_HOST}/leagues"
params = {
    "id": LEAGUE_ID
}

response = requests.get(url, headers=headers, params=params)

if response.status_code != 200:
    print(f"❌ Error: {response.status_code} - {response.text}")
else:
    data = response.json()
    if not data['response']:
        print(f"⚠️ No se encontró la liga con ID {LEAGUE_ID}")
    else:
        seasons = data['response'][0]['seasons']
        available_years = [s['year'] for s in seasons]
        print(f"✅ Temporadas disponibles para la liga {LEAGUE_ID}: {available_years}")
