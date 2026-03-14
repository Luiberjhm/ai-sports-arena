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

// Solo los partidos de HOY (formato YYYYMMDD)
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0].replace(/-/g, '');
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

  // Extraer número de jornada: buscar primero por palabra clave, luego por posición final
  let matchday: number | null = null;
  const headline: string = comp.notes?.[0]?.headline || '';
  const keywordMatch = headline.match(/(?:matchweek|week|round|jornada|matchday)\s+(\d+)/i);
  if (keywordMatch) {
    matchday = parseInt(keywordMatch[1]);
  } else {
    // Último número del headline como fallback (evita fechas del día al inicio)
    const lastNum = headline.match(/(\d+)\s*$/);
    if (lastNum && parseInt(lastNum[1]) <= 38) matchday = parseInt(lastNum[1]);
  }
  // También intentar desde event.week si existe (algunos deportes/competiciones)
  if (!matchday && event.week?.number) matchday = event.week.number;

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
    matchday,
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
    espnUrl   = `${ESPN_BASE}/soccer/${FOOTBALL_SLUGS[league]}/scoreboard?dates=${getTodayDate()}`;
    leagueId  = league;
    sportType = 'football';
  } else if (typeof sport === 'string' && AMERICAN_CONFIG[sport]) {
    const cfg = AMERICAN_CONFIG[sport];
    espnUrl   = `${ESPN_BASE}/${cfg.sport}/${cfg.league}/scoreboard?dates=${getTodayDate()}`;
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
