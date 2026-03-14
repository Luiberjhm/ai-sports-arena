import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * ============================================================
 * VERCEL FUNCTION — Sports Data Proxy
 * ============================================================
 * GET /api/sports?league=premier-league   → fútbol europeo
 * GET /api/sports?sport=nba              → deportes americanos
 *
 * Proxy server-side a ESPN para evitar:
 *   - Problemas de CORS en producción
 *   - Exposición de lógica de fetching al cliente
 *
 * Cache: 5 minutos en Vercel Edge (s-maxage=300)
 * ============================================================
 */

const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports';

const FOOTBALL_SLUGS: Record<string, string> = {
  'premier-league':   'eng.1',
  'laliga':           'esp.1',
  'serie-a':          'ita.1',
  'bundesliga':       'ger.1',
  'ligue-1':          'fra.1',
  'champions-league': 'uefa.champions',
  'europa-league':    'uefa.europa',
};

const AMERICAN_CONFIG: Record<string, { sport: string; league: string }> = {
  nba:  { sport: 'basketball', league: 'nba' },
  nfl:  { sport: 'football',   league: 'nfl' },
  mlb:  { sport: 'baseball',   league: 'mlb' },
  nhl:  { sport: 'hockey',     league: 'nhl' },
  ncaa: { sport: 'basketball', league: 'mens-college-basketball' },
};

// Rango: hoy → +14 días en formato YYYYMMDD-YYYYMMDD
function getDateRange(): string {
  const today = new Date();
  const future = new Date(today);
  future.setDate(today.getDate() + 14);
  const fmt = (d: Date) => d.toISOString().split('T')[0].replace(/-/g, '');
  return `${fmt(today)}-${fmt(future)}`;
}

// Validar que la fecha del partido sea futura y dentro de 30 días
function isValidFutureDate(dateStr: string): boolean {
  const matchDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 30);
  return matchDate >= today && matchDate <= maxDate;
}

// Transformar evento ESPN al formato Match de la app
function transformEvent(event: any, leagueId: string, sport: string): object | null {
  const comp = event.competitions?.[0];
  if (!comp) return null;

  const statusName: string = comp.status?.type?.name || '';
  const isScheduled = statusName === 'STATUS_SCHEDULED' || statusName === 'STATUS_POSTPONED';
  const isLive      = statusName === 'STATUS_IN_PROGRESS';
  if (!isScheduled && !isLive) return null;

  const home = comp.competitors?.find((c: any) => c.homeAway === 'home');
  const away = comp.competitors?.find((c: any) => c.homeAway === 'away');
  if (!home || !away) return null;

  // Validar nombres de equipo (filtrar placeholders vacíos)
  const homeName: string = home.team?.displayName || '';
  const awayName: string = away.team?.displayName || '';
  if (!homeName || !awayName) return null;

  const date = new Date(event.date);
  const dateStr = date.toISOString().split('T')[0];

  // Descartar partidos fuera del rango de fechas válido
  if (!isValidFutureDate(dateStr)) return null;

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
    venue:    comp.venue?.fullName || null,
    matchday: roundMatch ? parseInt(roundMatch[0]) : null,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Cache de 5 minutos en Vercel Edge — reduce llamadas a ESPN
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

  const { league, sport } = req.query;

  let espnUrl: string;
  let leagueId: string;
  let sportType: string;

  // Routing: fútbol europeo vs deportes americanos
  if (typeof league === 'string' && FOOTBALL_SLUGS[league]) {
    espnUrl   = `${ESPN_BASE}/soccer/${FOOTBALL_SLUGS[league]}/scoreboard?dates=${getDateRange()}`;
    leagueId  = league;
    sportType = 'football';
  } else if (typeof sport === 'string' && AMERICAN_CONFIG[sport]) {
    const cfg = AMERICAN_CONFIG[sport];
    espnUrl   = `${ESPN_BASE}/${cfg.sport}/${cfg.league}/scoreboard?dates=${getDateRange()}`;
    leagueId  = sport;
    sportType = sport;
  } else {
    return res.status(400).json({
      error: 'Parámetro inválido. Usa ?league=premier-league o ?sport=nba',
    });
  }

  try {
    const response = await fetch(espnUrl);

    if (!response.ok) {
      console.error(`ESPN HTTP ${response.status} para ${leagueId}`);
      return res.status(502).json({
        error: `ESPN no disponible (HTTP ${response.status}). Inténtalo más tarde.`,
      });
    }

    const data = await response.json();
    const events: any[] = data.events || [];

    const matches = events
      .map(e => transformEvent(e, leagueId, sportType))
      .filter(Boolean)
      .slice(0, 10);

    return res.status(200).json({
      matches,
      source:    'espn',
      fetchedAt: new Date().toISOString(),
      total:     matches.length,
    });

  } catch (err) {
    console.error(`Error en /api/sports [${leagueId}]:`, err);
    return res.status(502).json({
      error: 'No se pudo conectar con ESPN. Verifica tu conexión e inténtalo más tarde.',
    });
  }
}
