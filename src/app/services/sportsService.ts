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
const LEAGUE_API_IDS: Record<string, string> = {
  // TheSportsDB league IDs
  'premier-league': '4328', // English Premier League
  'laliga': '4335',         // Spanish La Liga
  'serie-a': '4332',        // Italian Serie A
  'bundesliga': '4331',     // German Bundesliga
  'ligue-1': '4334',        // French Ligue 1
  'champions-league': '4480',// UEFA Champions League
};

// ============================================================
// GET FOOTBALL MATCHES — By league
// ============================================================
export async function getFootballMatchday(leagueId: string): Promise<Match[]> {
  const apiId = LEAGUE_API_IDS[leagueId];

  // Si tenemos el ID real mapeado, intentamos llamar al Backend
  if (apiId) {
    try {
      // Usamos la API key pública '1' y pedimos TODA la temporada actual (2024-2025)
      // Evitamos el endpoint eventsnextleague porque en el plan gratis inyecta partidos falsos del 2022.
      const response = await fetch(`https://www.thesportsdb.com/api/v1/json/1/eventsseason.php?id=${apiId}&s=2024-2025`);

      if (response.ok) {
        const data = await response.json();
        if (data.events && data.events.length > 0) {
          // 1. Obtener fecha de hoy (a las 00:00 para no perder partidos de hoy)
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // 2. Filtrar estrictamente partidos que NO se hayan jugado (hoy o en el futuro)
          const futureEvents = data.events.filter((e: any) => {
            if (!e.dateEvent) return false;
            return new Date(e.dateEvent) >= today;
          });

          if (futureEvents.length > 0) {
            // 3. Ordenar cronológicamente (el partido más próximo primero)
            futureEvents.sort((a: any, b: any) => new Date(a.dateEvent).getTime() - new Date(b.dateEvent).getTime());

            // 4. Aislar la JORNADA EXACTA más próxima (para no mezclar con partidos del mes siguiente)
            const nextRound = futureEvents[0].intRound;
            const upcomingMatchday = futureEvents.filter((e: any) => e.intRound === nextRound);

            return transformTheSportsDBResponse(upcomingMatchday, leagueId);
          }
        }
        console.log(`No hay próximos partidos en TheSportsDB para ${leagueId}, usando mock data.`);
      }
    } catch (error) {
      console.error("Error conectando con API Real:", error);
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
// TRANSFORMER — Convert TheSportsDB response to Match[]
// ============================================================
function transformTheSportsDBResponse(events: any[], leagueId: string): Match[] {
  return events.map(e => ({
    id: e.idEvent,
    homeTeam: { name: e.strHomeTeam, abbreviation: e.strHomeTeam.substring(0, 3).toUpperCase() },
    awayTeam: { name: e.strAwayTeam, abbreviation: e.strAwayTeam.substring(0, 3).toUpperCase() },
    date: e.dateEvent || 'TBD',
    time: e.strTime ? e.strTime.substring(0, 5) : '00:00',
    leagueId: leagueId,
    sport: 'football',
    status: 'scheduled', // Al usar "eventsnextleague", todos son programados futuros
    venue: e.strVenue || 'Estadio por definir',
    matchday: parseInt(e.intRound) || 0,
  }));
}
