import requests

class LeagueDataManager:
    def __init__(self, api_key, base_url="http://api.football-data.org/v4"):
        self.api_key = api_key
        self.base_url = base_url
        self.la_liga_id = 2014  # ID de La Liga según Football-Data.org
        self.stats_cache = {}

    def fetch_league_standings(self):
        headers = {'X-Auth-Token': self.api_key}
        url = f"{self.base_url}/competitions/{self.la_liga_id}/standings?season=2023"
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            self.stats_cache[self.la_liga_id] = data.get('standings', [])[0].get('table', [])
            return self.stats_cache[self.la_liga_id]
        except requests.RequestException as e:
            print(f"Error fetching La Liga standings: {e}")
            return []

    def get_league_stats(self, league_name):
        if league_name.lower() != 'la liga':
            return []
        if self.la_liga_id not in self.stats_cache or not self.stats_cache[self.la_liga_id]:
            self.fetch_league_standings()
        return self.stats_cache.get(self.la_liga_id, [])