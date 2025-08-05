import requests

API_TOKEN = '93c90d11fead4b2b8b388a92d7ebf124'
BASE_URL = 'https://api.football-data.org/v4'
HEADERS = {'X-Auth-Token': API_TOKEN}

def listar_competiciones():
    url = f"{BASE_URL}/competitions"
    try:
        print("🔎 Buscando competiciones...")
        response = requests.get(url, headers=HEADERS)
        response.raise_for_status()
        data = response.json()

        for comp in data.get('competitions', []):
            print(f"🏆 {comp['name']} (ID: {comp['code']}) - {comp['area']['name']}")
    except Exception as e:
        print(f"❌ Error al obtener competiciones: {e}")

if __name__ == '__main__':
    listar_competiciones()
