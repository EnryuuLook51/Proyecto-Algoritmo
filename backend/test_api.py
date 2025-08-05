# backend/test_api.py (para encontrar la temporada correcta)
import requests
import json

API_KEY = "3662c82bee725cc73567b4594fa88001" # Reemplaza con tu clave
API_HOST = "v3.football.api-sports.io"
HEADERS = {'x-rapidapi-host': API_HOST, 'x-rapidapi-key': API_KEY}

LEAGUE_ID = 34 # Eliminatorias CONMEBOL

print("Buscando en qué año(s) están los datos de las eliminatorias...")
print("---------------------------------------------------------")

# Probemos varios años para encontrar los datos
for season in range(2015, 2018): # Probará 2020, 2021, 2022, 2023, 2024
    url = f"https://{API_HOST}/fixtures"
    params = {'league': LEAGUE_ID, 'season': season}

    try:
        response = requests.get(url, headers=HEADERS, params=params)
        response.raise_for_status()
        data = response.json()
        num_results = data.get('results', 0)

        if num_results > 0:
            print(f"¡ÉXITO! Temporada {season}: Se encontraron {num_results} partidos.")
        else:
            print(f"Temporada {season}: No se encontraron partidos.")

    except Exception as e:
        print(f"Error en la temporada {season}: {e}")

print("---------------------------------------------------------")
print("Búsqueda finalizada.")