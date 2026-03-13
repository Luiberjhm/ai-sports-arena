/**
 * ============================================================
 * SPORTS DATA SERVICE — AI Sports Analysis Arena
 * ============================================================
 * 
 * 🔌 BACKEND CONNECTION READY
 * 
 * To connect to real sports APIs:
 * 
 * Option 1 — API-Sports (Recommended - High Quality Data):
 *   Price: FREE (100 requests/day per sport).
 *   How to get FREE: Go to dashboard.api-football.com -> Subscriptions -> Subscribe to "Free Plan" (0€).
 *   Do this for: API-Football, API-Basketball, API-Baseball, etc.
 *   Set: VITE_FOOTBALL_API_KEY in .env
 * 
 * Option 2 — TheSportsDB (Alternative - Open Source):
 *   Price: 100% Free (Public Key: '2' or '3').
 *   Pros: No limits. Cons: Less detailed stats/odds for AI analysis.
 *   Docs: https://www.thesportsdb.com/api.php
 *   Set: VITE_ODDS_API_KEY in .env
 * 
 * Option 3 — via your NestJS backend:
 *   Set: VITE_BACKEND_URL in .env
 *   Your backend fetches from sports APIs and returns unified format
 * 
 * Real implementation example:
 * 
 * async function getMatchday(leagueId: string): Promise<Match[]> {
 *   const res = await fetch(`${BACKEND_URL}/api/matches/${leagueId}/current`);
 *   return res.json();
 * }
 */

import { Match, League } from '../types';
import {
  MOCK_MATCHES,
  MOCK_NBA_MATCHES,
  MOCK_NFL_MATCHES,
  MOCK_MLB_MATCHES,
  MOCK_NHL_MATCHES,
  MOCK_NCAA_MATCHES,
  FOOTBALL_LEAGUES,
} from '../data/mockData';

// ============================================================
// LEAGUE ID MAPPINGS — For real API connections
// ============================================================
const LEAGUE_API_IDS: Record<string, number> = {
  // API-Football Real IDs
  'premier-league': 39,
  'laliga': 140,
  'serie-a': 135,
  'bundesliga': 78,
  'ligue-1': 61,
  'champions-league': 2,
};

// ============================================================
// GET FOOTBALL MATCHES — By league
// ============================================================
export async function getFootballMatchday(leagueId: string): Promise<Match[]> {
  const apiId = LEAGUE_API_IDS[leagueId];

  // Si tenemos el ID real mapeado, intentamos llamar al Backend
  if (apiId) {
    try {
      // AQUI PONES TU API KEY REAL DE API-FOOTBALL
      // Intenta leer la variable de entorno, si no está, usa tu clave directamente
      const API_KEY = import.meta.env.VITE_SPORTS_API_KEY || 'a14758a7929301bbfb4a4f250ae9134b';

      // Pedimos exactamente los próximos 10 partidos de la temporada 2024. ¡Cero pasado!
      const response = await fetch(`https://v3.football.api-sports.io/fixtures?league=${apiId}&season=2024&next=10`, {
        method: 'GET',
        headers: {
          'x-apisports-key': API_KEY
        }
      });

      if (response.ok) {
        const data = await response.json();

        // API-Sports a veces devuelve 200 OK pero incluye los errores en el JSON
        if (data.errors && Object.keys(data.errors).length > 0) {
          console.error("🛑 Error interno de API-Sports:", data.errors);
        }

        if (data.response && data.response.length > 0) {
          return transformAPIFootballResponse(data.response, leagueId);
        }
        console.log(`⚠️ No hay próximos partidos en API-Football para ${leagueId}.`);
      } else {
        // Si la clave es inválida, suele dar error 401 o 403
        console.error(`🛑 Error HTTP ${response.status}: Verifica que tu API Key sea correcta y esté activa.`);
      }
    } catch (error) {
      console.error("🛑 Error de Red conectando con API Real:", error);
      // Fallback silencioso a mock data si falla la red o la API
    }
  }

  // FALLBACK: Si falla la API o no hay partidos, usamos datos de prueba
  return MOCK_MATCHES[leagueId] || [];
}

// ============================================================
// GET AMERICAN SPORTS MATCHES
// ============================================================
export async function getSportMatches(sport: string): Promise<Match[]> {
  // 🔌 BACKEND: Uncomment when backend is ready
  // if (BACKEND_URL) {
  //   const res = await fetch(`${BACKEND_URL}/api/${sport}/current`);
  //   return res.json();
  // }

  await new Promise(resolve => setTimeout(resolve, 250));

  const matchMap: Record<string, Match[]> = {
    nba: MOCK_NBA_MATCHES,
    nfl: MOCK_NFL_MATCHES,
    mlb: MOCK_MLB_MATCHES,
    nhl: MOCK_NHL_MATCHES,
    ncaa: MOCK_NCAA_MATCHES,
  };

  return matchMap[sport] || [];
}

// ============================================================
// GET ALL FOOTBALL LEAGUES
// ============================================================
export async function getFootballLeagues(): Promise<League[]> {
  // 🔌 BACKEND: Replace with real API call
  await new Promise(resolve => setTimeout(resolve, 100));
  return FOOTBALL_LEAGUES;
}

// ============================================================
// GET TODAY'S DATE INFO — For display
// ============================================================
export function getTodayInfo() {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return {
    formatted: now.toLocaleDateString('es-ES', options),
    date: now.toISOString().split('T')[0],
    dayName: now.toLocaleDateString('es-ES', { weekday: 'long' }),
  };
}

// ============================================================
// TRANSFORMER — Convert API-Football response to Match[]
// ============================================================
function transformAPIFootballResponse(fixtures: any[], leagueId: string): Match[] {
  return fixtures.map(f => ({
    id: f.fixture.id.toString(),
    homeTeam: { name: f.teams.home.name, abbreviation: f.teams.home.name.substring(0, 3).toUpperCase() },
    awayTeam: { name: f.teams.away.name, abbreviation: f.teams.away.name.substring(0, 3).toUpperCase() },
    date: f.fixture.date.split('T')[0],
    time: f.fixture.date.split('T')[1].substring(0, 5),
    leagueId: leagueId,
    sport: 'football',
    status: 'scheduled',
    venue: f.fixture.venue.name || 'Estadio por definir',
    matchday: typeof f.league.round === 'string' ? parseInt(f.league.round.replace(/\D/g, '')) || 0 : 0,
  }));
}
