export default async function handler(req: any, res: any) {
  // Configuración de cabeceras CORS para permitir peticiones desde tu web
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { sport, leagueId, date } = req.query;
  const apiKey = process.env.SPORTS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: API Key missing' });
  }

  // Mapeo de URLs según el deporte (API-Sports usa subdominios distintos)
  const BASE_URLS: Record<string, string> = {
    football: 'https://v3.football.api-sports.io',
    nba: 'https://v1.basketball.api-sports.io', // Baloncesto incluye NBA
    nfl: 'https://v1.american-football.api-sports.io',
    mlb: 'https://v1.baseball.api-sports.io',
    nhl: 'https://v1.hockey.api-sports.io',
    ncaa: 'https://v1.american-football.api-sports.io', // Asumimos NCAA Football por ahora
  };

  const baseUrl = BASE_URLS[sport as string] || BASE_URLS['football'];
  
  // Construir la URL específica (Endpoint de Fixtures/Games)
  // Nota: Cada deporte tiene parámetros ligeramente distintos, aquí estandarizamos para fútbol/games
  const endpoint = sport === 'football' ? '/fixtures' : '/games';
  
  try {
    const response = await fetch(`${baseUrl}${endpoint}?league=${leagueId}&date=${date}&season=2025`, {
      method: 'GET',
      headers: {
        'x-apisports-key': apiKey,
        'x-rapidapi-host': baseUrl.replace('https://', '')
      }
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data from API-Sports' });
  }
}