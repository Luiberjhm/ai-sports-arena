/**
 * ============================================================
 * SPORTS DATA SERVICE — AI Sports Analysis Arena
 * ============================================================
 *
 * Fuente real: ESPN API via Vercel Function proxy (/api/sports)
 *
 * Flujo de datos:
 *   PRODUCCIÓN (Vercel):
 *     Browser → /api/sports?league=X → Vercel Function → ESPN → Match[]
 *
 *   DESARROLLO LOCAL (npm run dev):
 *     Browser → /api/sports  [falla, Function no existe]
 *             → ESPN directo  [fallback, CORS abierto en localhost]
 *             → Mock data     [solo si VITE_USE_MOCK=true]
 *
 * Variables de entorno:
 *   VITE_USE_MOCK=false  → producción (nunca usa mock)
 *   VITE_USE_MOCK=true   → desarrollo local (permite mock como último recurso)
 *
 * IMPORTANTE: Si no hay partidos reales disponibles y VITE_USE_MOCK=false,
 * se devuelve [] — la UI debe bloquear el botón RUN en ese caso.
 * Las IAs NUNCA analizan partidos mock en producción.
 * ============================================================
 */

import { Match, League, Sport } from '../types';
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
// CONFIG
// ============================================================
const ESPN_BASE  = 'https://site.api.espn.com/apis/site/v2/sports';
const IS_DEV     = import.meta.env.DEV;
const USE_MOCK   = import.meta.env.VITE_USE_MOCK === 'true';

const FOOTBALL_ESPN_SLUGS: Record<string, string> = {
  'premier-league':   'eng.1',
  'laliga':           'esp.1',
  'serie-a':          'ita.1',
  'bundesliga':       'ger.1',
  'ligue-1':          'fra.1',
  'champions-league': 'uefa.champions',
  'europa-league':    'uefa.europa',
};

const AMERICAN_ESPN_CONFIG: Record<string, { sport: string; league: string; type: Sport }> = {
  nba:  { sport: 'basketball', league: 'nba',                     type: 'nba'  },
  nfl:  { sport: 'football',   league: 'nfl',                     type: 'nfl'  },
  mlb:  { sport: 'baseball',   league: 'mlb',                     type: 'mlb'  },
  nhl:  { sport: 'hockey',     league: 'nhl',                     type: 'nhl'  },
  ncaa: { sport: 'basketball', league: 'mens-college-basketball', type: 'ncaa' },
};

// ============================================================
// METADATA — Lo que devuelve /api/sports para transparencia en UI
// ============================================================
export interface SportsAPIResult {
  matches:   Match[];
  source:    'espn' | 'espn-direct' | 'mock' | 'empty';
  fetchedAt: string;
  total:     number;
}

// ============================================================
// DATE RANGE — hoy → +14 días (YYYYMMDD-YYYYMMDD)
// ============================================================
function getDateRange(): string {
  const today  = new Date();
  const future = new Date(today);
  future.setDate(today.getDate() + 14);
  const fmt = (d: Date) => d.toISOString().split('T')[0].replace(/-/g, '');
  return `${fmt(today)}-${fmt(future)}`;
}

// ============================================================
// TRANSFORMER — Evento ESPN crudo → Match tipado
// ============================================================
function transformESPNEvent(event: any, leagueId: string, sport: Sport): Match | null {
  const comp = event.competitions?.[0];
  if (!comp) return null;

  const statusName: string = comp.status?.type?.name || '';
  const isScheduled = statusName === 'STATUS_SCHEDULED' || statusName === 'STATUS_POSTPONED';
  const isLive      = statusName === 'STATUS_IN_PROGRESS';
  if (!isScheduled && !isLive) return null;

  const home = comp.competitors?.find((c: any) => c.homeAway === 'home');
  const away = comp.competitors?.find((c: any) => c.homeAway === 'away');
  if (!home || !away) return null;

  const homeName: string = home.team?.displayName || '';
  const awayName: string = away.team?.displayName || '';
  if (!homeName || !awayName) return null;

  const date    = new Date(event.date);
  const dateStr = date.toISOString().split('T')[0];

  // Validar rango de fecha: solo partidos futuros (hasta 30 días)
  const today   = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 30);
  const matchDate = new Date(dateStr);
  if (matchDate < today || matchDate > maxDate) return null;

  const headline: string = comp.notes?.[0]?.headline || '';
  const roundMatch = headline.match(/\d+/);

  return {
    id:       String(event.id),
    homeTeam: {
      name:         homeName,
      abbreviation: home.team.abbreviation || homeName.substring(0, 3).toUpperCase(),
    },
    awayTeam: {
      name:         awayName,
      abbreviation: away.team.abbreviation || awayName.substring(0, 3).toUpperCase(),
    },
    date:     dateStr,
    time:     date.toTimeString().substring(0, 5),
    leagueId,
    sport,
    status:   isLive ? 'live' : 'scheduled',
    venue:    comp.venue?.fullName,
    matchday: roundMatch ? parseInt(roundMatch[0]) : undefined,
  };
}

// ============================================================
// CORE FETCHER — Lógica de cascada: proxy → directo → mock/vacío
// ============================================================
async function fetchSportsData(
  apiQuery:   string,   // e.g. "league=premier-league" | "sport=nba"
  espnUrl:    string,   // URL directa de ESPN (solo se usa en dev)
  leagueId:   string,
  sport:      Sport,
  mockFallback: Match[]
): Promise<SportsAPIResult> {
  const now = new Date().toISOString();

  // ── 1. Vercel Function proxy (funciona en producción siempre) ──────────
  try {
    const res = await fetch(`/api/sports?${apiQuery}`);
    if (res.ok) {
      const data = await res.json();
      if (data.matches && data.matches.length > 0) {
        console.log(`✅ Proxy [${leagueId}]: ${data.total} partidos reales | ESPN | ${data.fetchedAt}`);
        return { matches: data.matches as Match[], source: 'espn', fetchedAt: data.fetchedAt, total: data.total };
      }
      // Proxy OK pero sin partidos — sin fallback a mock en prod
      if (!IS_DEV) {
        console.warn(`⚠️ Proxy [${leagueId}]: sin partidos en los próximos 14 días (fuera de temporada?)`);
        return { matches: [], source: 'empty', fetchedAt: now, total: 0 };
      }
    }
  } catch {
    // /api/sports no disponible — normal en dev con `npm run dev`
    if (!IS_DEV) {
      console.error(`🛑 Proxy [${leagueId}]: Vercel Function no respondió en producción`);
    }
  }

  // ── 2. ESPN directo (solo en desarrollo local) ─────────────────────────
  if (IS_DEV) {
    try {
      const res = await fetch(espnUrl);
      if (res.ok) {
        const data = await res.json();
        const matches = (data.events || [])
          .map((e: any) => transformESPNEvent(e, leagueId, sport))
          .filter((m: Match | null): m is Match => m !== null)
          .slice(0, 10);

        if (matches.length > 0) {
          console.log(`✅ ESPN directo [${leagueId}]: ${matches.length} partidos reales (dev)`);
          return { matches, source: 'espn-direct', fetchedAt: now, total: matches.length };
        }
        console.warn(`⚠️ ESPN directo [${leagueId}]: sin partidos programados`);
      }
    } catch (err) {
      console.error(`🛑 ESPN directo [${leagueId}]:`, err);
    }
  }

  // ── 3. Mock data (SOLO si VITE_USE_MOCK=true, para desarrollo) ─────────
  if (USE_MOCK) {
    console.warn(`⚠️ [${leagueId}]: Usando mock data (VITE_USE_MOCK=true) — NO apto para producción`);
    return { matches: mockFallback, source: 'mock', fetchedAt: now, total: mockFallback.length };
  }

  // ── 4. Sin datos reales — la UI debe mostrar error y bloquear RUN ──────
  console.warn(`⚠️ [${leagueId}]: Sin partidos reales disponibles`);
  return { matches: [], source: 'empty', fetchedAt: now, total: 0 };
}

// ============================================================
// GET FOOTBALL MATCHES — Por liga (fútbol europeo)
// ============================================================
export async function getFootballMatchday(leagueId: string): Promise<SportsAPIResult> {
  const slug = FOOTBALL_ESPN_SLUGS[leagueId];
  const espnUrl = slug
    ? `${ESPN_BASE}/soccer/${slug}/scoreboard?dates=${getDateRange()}`
    : '';

  return fetchSportsData(
    `league=${leagueId}`,
    espnUrl,
    leagueId,
    'football',
    MOCK_MATCHES[leagueId] || []
  );
}

// ============================================================
// GET AMERICAN SPORTS MATCHES
// ============================================================
export async function getSportMatches(sport: string): Promise<SportsAPIResult> {
  const cfg     = AMERICAN_ESPN_CONFIG[sport];
  const espnUrl = cfg
    ? `${ESPN_BASE}/${cfg.sport}/${cfg.league}/scoreboard?dates=${getDateRange()}`
    : '';

  const fallbackMap: Record<string, Match[]> = {
    nba:  MOCK_NBA_MATCHES,
    nfl:  MOCK_NFL_MATCHES,
    mlb:  MOCK_MLB_MATCHES,
    nhl:  MOCK_NHL_MATCHES,
    ncaa: MOCK_NCAA_MATCHES,
  };

  return fetchSportsData(
    `sport=${sport}`,
    espnUrl,
    sport,
    cfg?.type || (sport as Sport),
    fallbackMap[sport] || []
  );
}

// ============================================================
// GET ALL FOOTBALL LEAGUES — Para los tabs de la UI
// ============================================================
export async function getFootballLeagues(): Promise<League[]> {
  return FOOTBALL_LEAGUES;
}

// ============================================================
// GET TODAY'S DATE INFO — Para mostrar en la UI
// ============================================================
export function getTodayInfo() {
  const now = new Date();
  return {
    formatted: now.toLocaleDateString('es-ES', {
      weekday: 'long',
      year:    'numeric',
      month:   'long',
      day:     'numeric',
    }),
    date:    now.toISOString().split('T')[0],
    dayName: now.toLocaleDateString('es-ES', { weekday: 'long' }),
  };
}
