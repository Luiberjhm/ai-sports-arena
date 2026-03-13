import type { VercelRequest, VercelResponse } from '@vercel/node';

// Definición de la interfaz Match y Team, para que el archivo sea autocontenido.
// Lo ideal es que estos tipos vengan de `src/app/types`, pero en el entorno serverless de Vercel
// es más simple mantener las dependencias al mínimo.
type Sport = 'football' | 'nba' | 'nfl' | 'mlb' | 'nhl' | 'ncaa';

interface Team {
  name: string;
  abbreviation: string;
}

interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  time: string;
  leagueId: string;
  sport: Sport;
  status: 'scheduled' | 'live' | 'finished';
  homeScore?: number;
  awayScore?: number;
  matchday?: number;
  venue?: string;
}

// Mapeo de IDs de ligas del frontend a los IDs numéricos de API-Sports
const LEAGUE_ID_MAP: Record<string, number> = {
  'premier-league': 39,
  'laliga': 140,
  'serie-a': 135,
  'bundesliga': 78,
  'ligue-1': 61,
  'champions-league': 2,
};

// Función para generar una abreviatura de 3 letras a partir del nombre del equipo
const createAbbreviation = (name: string): string => {
  return name.substring(0, 3).toUpperCase();
};

// Mapeo de estados de partido de API-Sports a los estados de nuestra app
const getStatus = (apiStatus: string): 'scheduled' | 'live' | 'finished' => {
  switch (apiStatus) {
    case 'TBD': // Time To Be Defined
    case 'NS':  // Not Started
    case 'PST': // Postponed
      return 'scheduled';
    case 'LIVE':
    case '1H':
    case 'HT':
    case '2H':
    case 'ET':
    case 'BT':
    case 'P':
    case 'INT':
      return 'live';
    case 'FT':  // Finished
    case 'AET': // Finished after extra time
    case 'PEN': // Finished after penalties
      return 'finished';
    default:
      return 'scheduled';
  }
};


export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { league, date } = req.query;

  // 1. Validar parámetros de entrada
  if (typeof league !== 'string' || !LEAGUE_ID_MAP[league]) {
    return res.status(400).json({ error: 'Parámetro de liga inválido o faltante.' });
  }
  if (typeof date !== 'string') {
    return res.status(400).json({ error: 'Parámetro de fecha inválido o faltante.' });
  }

  const leagueId = LEAGUE_ID_MAP[league];
  const apiKey = process.env.SPORTS_API_KEY;

  // 2. Validar clave de API
  if (!apiKey) {
    return res.status(500).json({ error: 'La clave de API para deportes no está configurada en el servidor.' });
  }

  const url = `https://v3.football.api-sports.io/fixtures?league=${leagueId}&season=2025&date=${date}`;

  try {
    // 3. Realizar la llamada a la API externa
    const apiResponse = await fetch(url, {
      headers: {
        'x-apisports-key': apiKey,
      },
    });

    if (!apiResponse.ok) {
      console.error('Error desde API-Sports:', await apiResponse.text());
      return res.status(apiResponse.status).json({ error: 'Error al contactar al proveedor de datos deportivos.' });
    }

    const data = await apiResponse.json();

    if (data.errors && Object.keys(data.errors).length > 0) {
        console.error('Errores en la respuesta de API-Sports:', data.errors);
        return res.status(400).json({ error: 'La solicitud de datos deportivos contiene errores.', details: data.errors });
    }
    
    // 4. Transformar los datos al formato de la aplicación
    const matches: Match[] = data.response.map((fixtureData: any): Match => {
      const { fixture, teams, league, goals } = fixtureData;
      const fixtureDate = new Date(fixture.date);

      return {
        id: String(fixture.id),
        homeTeam: {
          name: teams.home.name,
          abbreviation: createAbbreviation(teams.home.name),
        },
        awayTeam: {
          name: teams.away.name,
          abbreviation: createAbbreviation(teams.away.name),
        },
        date: fixtureDate.toISOString().split('T')[0],
        time: fixtureDate.toTimeString().substring(0, 5),
        leagueId: league, // Usamos el ID de string original
        sport: 'football',
        status: getStatus(fixture.status.short),
        homeScore: goals.home,
        awayScore: goals.away,
        matchday: parseInt(league.round.replace(/[^0-9]/g, ''), 10) || undefined,
        venue: fixture.venue.name,
      };
    });

    // 5. Enviar la respuesta transformada
    return res.status(200).json(matches);

  } catch (error) {
    console.error('Error interno en la función del servidor:', error);
    return res.status(500).json({ error: 'Ocurrió un error inesperado en el servidor.' });
  }
}
