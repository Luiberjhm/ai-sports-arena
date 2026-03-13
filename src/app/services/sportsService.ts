/**
 * ============================================================
 * SPORTS DATA SERVICE — AI Sports Analysis Arena
 * ============================================================
 * 
 * 🔌 BACKEND CONNECTION READY
 * 
 * To connect to real sports APIs:
 * 
 * Option 1 — API-Football (football data):
 *   Base: https://api-sports.io/
 *   Docs: https://www.api-football.com/documentation-v3
 *   Set: VITE_FOOTBALL_API_KEY in .env
 * 
 * Option 2 — The Odds API (betting odds):
 *   Base: https://api.the-odds-api.com/
 *   Docs: https://the-odds-api.com/lossless-oddsapi/
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

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || null;
const FOOTBALL_API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY || null;

// ============================================================
// LEAGUE ID MAPPINGS — For real API connections
// ============================================================
const LEAGUE_API_IDS: Record<string, number> = {
  // API-Football league IDs
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
  // 🔌 REAL API: Uncomment when API key is available
  // if (FOOTBALL_API_KEY) {
  //   const apiId = LEAGUE_API_IDS[leagueId];
  //   const today = new Date().toISOString().split('T')[0];
  //   const response = await fetch(
  //     `https://v3.football.api-sports.io/fixtures?league=${apiId}&season=2025&from=${today}&to=${today}`,
  //     { headers: { 'x-apisports-key': FOOTBALL_API_KEY } }
  //   );
  //   const data = await response.json();
  //   return transformAPIFootballResponse(data.response);
  // }

  // 🔌 BACKEND: Uncomment when backend is ready
  // if (BACKEND_URL) {
  //   const res = await fetch(`${BACKEND_URL}/api/football/${leagueId}/current`);
  //   return res.json();
  // }

  // MOCK: Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
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
// TRANSFORMER — Convert real API-Football response to Match[]
// ============================================================
// function transformAPIFootballResponse(fixtures: any[]): Match[] {
//   return fixtures.map(f => ({
//     id: f.fixture.id.toString(),
//     homeTeam: { name: f.teams.home.name, abbreviation: f.teams.home.name.slice(0, 3).toUpperCase() },
//     awayTeam: { name: f.teams.away.name, abbreviation: f.teams.away.name.slice(0, 3).toUpperCase() },
//     date: f.fixture.date.split('T')[0],
//     time: f.fixture.date.split('T')[1].slice(0, 5),
//     leagueId: f.league.id.toString(),
//     sport: 'football',
//     status: f.fixture.status.short === 'NS' ? 'scheduled' : 'finished',
//     venue: f.fixture.venue?.name,
//     matchday: f.league.round,
//   }));
// }
