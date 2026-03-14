import { AIModel, League, Match, Sport, SportConfig } from '../types';

// ============================================================
// AI MODELS — 5 motores de análisis
// ============================================================
export const AI_MODELS: AIModel[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    provider: 'OpenAI',
    color: '#74AA9C',
    accuracy: 68.5,
    totalPicks: 247,
    correctPicks: 169,
    currentStreak: 3,
    rank: 3,
    heatmap: [true, false, true, true, false, true, true, false, true, true],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    provider: 'Google',
    color: '#4285F4',
    accuracy: 71.2,
    totalPicks: 251,
    correctPicks: 179,
    currentStreak: 5,
    rank: 1,
    heatmap: [true, true, true, false, true, true, true, false, true, true],
  },
  {
    id: 'claude',
    name: 'Claude',
    provider: 'Anthropic',
    color: '#D4956A',
    accuracy: 66.8,
    totalPicks: 239,
    correctPicks: 160,
    currentStreak: -2,
    rank: 4,
    heatmap: [false, true, false, true, true, false, true, false, false, true],
  },
  {
    id: 'qwen',
    name: 'Qwen',
    provider: 'Alibaba',
    color: '#A855F7',
    accuracy: 64.3,
    totalPicks: 228,
    correctPicks: 147,
    currentStreak: 1,
    rank: 5,
    heatmap: [true, false, false, true, false, true, true, false, true, false],
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    provider: 'Perplexity AI',
    color: '#1FB8C3',
    accuracy: 69.7,
    totalPicks: 244,
    correctPicks: 170,
    currentStreak: 4,
    rank: 2,
    heatmap: [true, true, false, true, true, false, true, true, true, false],
  },
];

// ============================================================
// SPORTS CONFIG
// ============================================================
export const SPORT_CONFIGS: SportConfig[] = [
  { id: 'football', name: 'Fútbol', emoji: '⚽', path: '/futbol', color: '#22C55E' },
  { id: 'nba', name: 'NBA', emoji: '🏀', path: '/nba', color: '#F97316' },
  { id: 'nfl', name: 'NFL', emoji: '🏈', path: '/nfl', color: '#3B82F6' },
  { id: 'mlb', name: 'MLB', emoji: '⚾', path: '/mlb', color: '#EF4444' },
  { id: 'nhl', name: 'NHL', emoji: '🏒', path: '/nhl', color: '#06B6D4' },
  { id: 'ncaa', name: 'NCAA', emoji: '🎓', path: '/ncaa', color: '#8B5CF6' },
];

// ============================================================
// FOOTBALL LEAGUES — 6 ligas europeas
// ============================================================
export const FOOTBALL_LEAGUES: League[] = [
  {
    id: 'premier-league',
    name: 'Premier League',
    shortName: 'PL',
    country: 'Inglaterra',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    sport: 'football',
    currentMatchday: 29,
    season: '2025/26',
  },
  {
    id: 'laliga',
    name: 'La Liga',
    shortName: 'LaLiga',
    country: 'España',
    flag: '🇪🇸',
    sport: 'football',
    currentMatchday: 29,
    season: '2025/26',
  },
  {
    id: 'serie-a',
    name: 'Serie A',
    shortName: 'Serie A',
    country: 'Italia',
    flag: '🇮🇹',
    sport: 'football',
    currentMatchday: 29,
    season: '2025/26',
  },
  {
    id: 'bundesliga',
    name: 'Bundesliga',
    shortName: 'BL',
    country: 'Alemania',
    flag: '🇩🇪',
    sport: 'football',
    currentMatchday: 27,
    season: '2025/26',
  },
  {
    id: 'ligue-1',
    name: 'Ligue 1',
    shortName: 'L1',
    country: 'Francia',
    flag: '🇫🇷',
    sport: 'football',
    currentMatchday: 28,
    season: '2025/26',
  },
  {
    id: 'champions-league',
    name: 'Champions League',
    shortName: 'UCL',
    country: 'Europa',
    flag: '🏆',
    sport: 'football',
    currentMatchday: 8,
    season: '2025/26',
  },
  {
    id: 'europa-league',
    name: 'Europa League',
    shortName: 'UEL',
    country: 'Europa',
    flag: '🟠',
    sport: 'football',
    currentMatchday: 8,
    season: '2025/26',
  },
];

// ============================================================
// MOCK MATCHES
// ============================================================
export const MOCK_MATCHES: Record<string, Match[]> = {
  'premier-league': [
    { id: 'pl-1', homeTeam: { name: 'Arsenal', abbreviation: 'ARS' }, awayTeam: { name: 'Chelsea', abbreviation: 'CHE' }, date: '2026-03-14', time: '15:00', leagueId: 'premier-league', sport: 'football', status: 'scheduled', matchday: 29, venue: 'Emirates Stadium' },
    { id: 'pl-2', homeTeam: { name: 'Manchester City', abbreviation: 'MCI' }, awayTeam: { name: 'Liverpool', abbreviation: 'LIV' }, date: '2026-03-14', time: '17:30', leagueId: 'premier-league', sport: 'football', status: 'scheduled', matchday: 29, venue: 'Etihad Stadium' },
    { id: 'pl-3', homeTeam: { name: 'Tottenham', abbreviation: 'TOT' }, awayTeam: { name: 'Man. United', abbreviation: 'MUN' }, date: '2026-03-14', time: '20:00', leagueId: 'premier-league', sport: 'football', status: 'scheduled', matchday: 29, venue: 'Tottenham Hotspur Stadium' },
    { id: 'pl-4', homeTeam: { name: 'Newcastle', abbreviation: 'NEW' }, awayTeam: { name: 'Aston Villa', abbreviation: 'AVL' }, date: '2026-03-15', time: '14:00', leagueId: 'premier-league', sport: 'football', status: 'scheduled', matchday: 29, venue: "St. James' Park" },
    { id: 'pl-5', homeTeam: { name: 'Brighton', abbreviation: 'BHA' }, awayTeam: { name: 'West Ham', abbreviation: 'WHU' }, date: '2026-03-15', time: '16:00', leagueId: 'premier-league', sport: 'football', status: 'scheduled', matchday: 29, venue: 'Amex Stadium' },
    { id: 'pl-6', homeTeam: { name: 'Brentford', abbreviation: 'BRE' }, awayTeam: { name: 'Fulham', abbreviation: 'FUL' }, date: '2026-03-15', time: '16:00', leagueId: 'premier-league', sport: 'football', status: 'scheduled', matchday: 29, venue: 'Gtech Community Stadium' },
  ],
  'laliga': [
    { id: 'll-1', homeTeam: { name: 'Real Madrid', abbreviation: 'RMA' }, awayTeam: { name: 'FC Barcelona', abbreviation: 'FCB' }, date: '2026-03-15', time: '21:00', leagueId: 'laliga', sport: 'football', status: 'scheduled', matchday: 29, venue: 'Santiago Bernabéu' },
    { id: 'll-2', homeTeam: { name: 'Atlético Madrid', abbreviation: 'ATM' }, awayTeam: { name: 'Sevilla', abbreviation: 'SEV' }, date: '2026-03-14', time: '18:30', leagueId: 'laliga', sport: 'football', status: 'scheduled', matchday: 29, venue: 'Cívitas Metropolitano' },
    { id: 'll-3', homeTeam: { name: 'Athletic Club', abbreviation: 'ATH' }, awayTeam: { name: 'Real Betis', abbreviation: 'BET' }, date: '2026-03-14', time: '16:15', leagueId: 'laliga', sport: 'football', status: 'scheduled', matchday: 29, venue: 'San Mamés' },
    { id: 'll-4', homeTeam: { name: 'Villarreal', abbreviation: 'VIL' }, awayTeam: { name: 'Valencia', abbreviation: 'VAL' }, date: '2026-03-15', time: '14:00', leagueId: 'laliga', sport: 'football', status: 'scheduled', matchday: 29, venue: 'Estadio de la Cerámica' },
    { id: 'll-5', homeTeam: { name: 'Real Sociedad', abbreviation: 'RSO' }, awayTeam: { name: 'Osasuna', abbreviation: 'OSA' }, date: '2026-03-15', time: '19:00', leagueId: 'laliga', sport: 'football', status: 'scheduled', matchday: 29, venue: 'Reale Arena' },
  ],
  'serie-a': [
    { id: 'sa-1', homeTeam: { name: 'Inter Milan', abbreviation: 'INT' }, awayTeam: { name: 'AC Milan', abbreviation: 'MIL' }, date: '2026-03-14', time: '20:45', leagueId: 'serie-a', sport: 'football', status: 'scheduled', matchday: 29, venue: 'San Siro' },
    { id: 'sa-2', homeTeam: { name: 'Juventus', abbreviation: 'JUV' }, awayTeam: { name: 'Napoli', abbreviation: 'NAP' }, date: '2026-03-15', time: '18:00', leagueId: 'serie-a', sport: 'football', status: 'scheduled', matchday: 29, venue: 'Juventus Stadium' },
    { id: 'sa-3', homeTeam: { name: 'Roma', abbreviation: 'ROM' }, awayTeam: { name: 'Lazio', abbreviation: 'LAZ' }, date: '2026-03-15', time: '20:45', leagueId: 'serie-a', sport: 'football', status: 'scheduled', matchday: 29, venue: 'Stadio Olimpico' },
    { id: 'sa-4', homeTeam: { name: 'Atalanta', abbreviation: 'ATA' }, awayTeam: { name: 'Fiorentina', abbreviation: 'FIO' }, date: '2026-03-14', time: '15:00', leagueId: 'serie-a', sport: 'football', status: 'scheduled', matchday: 29, venue: 'Gewiss Stadium' },
  ],
  'bundesliga': [
    { id: 'bl-1', homeTeam: { name: 'Bayern Munich', abbreviation: 'BAY' }, awayTeam: { name: 'Borussia Dortmund', abbreviation: 'BVB' }, date: '2026-03-14', time: '18:30', leagueId: 'bundesliga', sport: 'football', status: 'scheduled', matchday: 27, venue: 'Allianz Arena' },
    { id: 'bl-2', homeTeam: { name: 'Bayer Leverkusen', abbreviation: 'LEV' }, awayTeam: { name: 'RB Leipzig', abbreviation: 'RBL' }, date: '2026-03-14', time: '15:30', leagueId: 'bundesliga', sport: 'football', status: 'scheduled', matchday: 27, venue: 'BayArena' },
    { id: 'bl-3', homeTeam: { name: 'Eintracht Frankfurt', abbreviation: 'SGE' }, awayTeam: { name: 'Wolfsburg', abbreviation: 'WOB' }, date: '2026-03-15', time: '15:30', leagueId: 'bundesliga', sport: 'football', status: 'scheduled', matchday: 27, venue: 'Deutsche Bank Park' },
    { id: 'bl-4', homeTeam: { name: 'Freiburg', abbreviation: 'SCF' }, awayTeam: { name: 'Stuttgart', abbreviation: 'VFB' }, date: '2026-03-15', time: '17:30', leagueId: 'bundesliga', sport: 'football', status: 'scheduled', matchday: 27, venue: 'Europa-Park Stadion' },
  ],
  'ligue-1': [
    { id: 'l1-1', homeTeam: { name: 'Paris SG', abbreviation: 'PSG' }, awayTeam: { name: 'Olympique de Marseille', abbreviation: 'OM' }, date: '2026-03-15', time: '21:05', leagueId: 'ligue-1', sport: 'football', status: 'scheduled', matchday: 28, venue: 'Parc des Princes' },
    { id: 'l1-2', homeTeam: { name: 'Monaco', abbreviation: 'ASM' }, awayTeam: { name: 'Lens', abbreviation: 'LEN' }, date: '2026-03-14', time: '17:00', leagueId: 'ligue-1', sport: 'football', status: 'scheduled', matchday: 28, venue: 'Stade Louis II' },
    { id: 'l1-3', homeTeam: { name: 'Lyon', abbreviation: 'OL' }, awayTeam: { name: 'Lille', abbreviation: 'LIL' }, date: '2026-03-15', time: '19:00', leagueId: 'ligue-1', sport: 'football', status: 'scheduled', matchday: 28, venue: 'Groupama Stadium' },
  ],
  'champions-league': [
    { id: 'ucl-1', homeTeam: { name: 'Real Madrid', abbreviation: 'RMA' }, awayTeam: { name: 'Manchester City', abbreviation: 'MCI' }, date: '2026-03-18', time: '21:00', leagueId: 'champions-league', sport: 'football', status: 'scheduled', matchday: 8, venue: 'Santiago Bernabéu' },
    { id: 'ucl-2', homeTeam: { name: 'Bayern Munich', abbreviation: 'BAY' }, awayTeam: { name: 'Arsenal', abbreviation: 'ARS' }, date: '2026-03-18', time: '21:00', leagueId: 'champions-league', sport: 'football', status: 'scheduled', matchday: 8, venue: 'Allianz Arena' },
    { id: 'ucl-3', homeTeam: { name: 'PSG', abbreviation: 'PSG' }, awayTeam: { name: 'Inter Milan', abbreviation: 'INT' }, date: '2026-03-19', time: '21:00', leagueId: 'champions-league', sport: 'football', status: 'scheduled', matchday: 8, venue: 'Parc des Princes' },
  ],
  'europa-league': [
    { id: 'uel-1', homeTeam: { name: 'Manchester United', abbreviation: 'MUN' }, awayTeam: { name: 'Athletic Club', abbreviation: 'ATH' }, date: '2026-03-19', time: '21:00', leagueId: 'europa-league', sport: 'football', status: 'scheduled', matchday: 8, venue: 'Old Trafford' },
    { id: 'uel-2', homeTeam: { name: 'Eintracht Frankfurt', abbreviation: 'SGE' }, awayTeam: { name: 'Lyon', abbreviation: 'OL' }, date: '2026-03-19', time: '21:00', leagueId: 'europa-league', sport: 'football', status: 'scheduled', matchday: 8, venue: 'Deutsche Bank Park' },
    { id: 'uel-3', homeTeam: { name: 'Lazio', abbreviation: 'LAZ' }, awayTeam: { name: 'Ajax', abbreviation: 'AJX' }, date: '2026-03-20', time: '21:00', leagueId: 'europa-league', sport: 'football', status: 'scheduled', matchday: 8, venue: 'Stadio Olimpico' },
  ],
};

// American Sports Matches
export const MOCK_NBA_MATCHES: Match[] = [
  { id: 'nba-1', homeTeam: { name: 'Los Angeles Lakers', abbreviation: 'LAL' }, awayTeam: { name: 'Boston Celtics', abbreviation: 'BOS' }, date: '2026-03-14', time: '22:30', leagueId: 'nba', sport: 'nba', status: 'scheduled', venue: 'Crypto.com Arena' },
  { id: 'nba-2', homeTeam: { name: 'Golden State Warriors', abbreviation: 'GSW' }, awayTeam: { name: 'Denver Nuggets', abbreviation: 'DEN' }, date: '2026-03-14', time: '02:00', leagueId: 'nba', sport: 'nba', status: 'scheduled', venue: 'Chase Center' },
  { id: 'nba-3', homeTeam: { name: 'Miami Heat', abbreviation: 'MIA' }, awayTeam: { name: 'Milwaukee Bucks', abbreviation: 'MIL' }, date: '2026-03-14', time: '23:00', leagueId: 'nba', sport: 'nba', status: 'scheduled', venue: 'Kaseya Center' },
  { id: 'nba-4', homeTeam: { name: 'Phoenix Suns', abbreviation: 'PHX' }, awayTeam: { name: 'Dallas Mavericks', abbreviation: 'DAL' }, date: '2026-03-15', time: '01:00', leagueId: 'nba', sport: 'nba', status: 'scheduled', venue: 'Footprint Center' },
];

export const MOCK_NFL_MATCHES: Match[] = [
  { id: 'nfl-1', homeTeam: { name: 'Kansas City Chiefs', abbreviation: 'KC' }, awayTeam: { name: 'San Francisco 49ers', abbreviation: 'SF' }, date: '2026-03-14', time: '23:25', leagueId: 'nfl', sport: 'nfl', status: 'scheduled', venue: 'Arrowhead Stadium' },
  { id: 'nfl-2', homeTeam: { name: 'Dallas Cowboys', abbreviation: 'DAL' }, awayTeam: { name: 'Philadelphia Eagles', abbreviation: 'PHI' }, date: '2026-03-14', time: '19:00', leagueId: 'nfl', sport: 'nfl', status: 'scheduled', venue: 'AT&T Stadium' },
  { id: 'nfl-3', homeTeam: { name: 'Green Bay Packers', abbreviation: 'GB' }, awayTeam: { name: 'Chicago Bears', abbreviation: 'CHI' }, date: '2026-03-15', time: '18:00', leagueId: 'nfl', sport: 'nfl', status: 'scheduled', venue: 'Lambeau Field' },
];

export const MOCK_MLB_MATCHES: Match[] = [
  { id: 'mlb-1', homeTeam: { name: 'New York Yankees', abbreviation: 'NYY' }, awayTeam: { name: 'Boston Red Sox', abbreviation: 'BOS' }, date: '2026-03-14', time: '19:05', leagueId: 'mlb', sport: 'mlb', status: 'scheduled', venue: 'Yankee Stadium' },
  { id: 'mlb-2', homeTeam: { name: 'Los Angeles Dodgers', abbreviation: 'LAD' }, awayTeam: { name: 'San Francisco Giants', abbreviation: 'SF' }, date: '2026-03-14', time: '22:10', leagueId: 'mlb', sport: 'mlb', status: 'scheduled', venue: 'Dodger Stadium' },
  { id: 'mlb-3', homeTeam: { name: 'Chicago Cubs', abbreviation: 'CHC' }, awayTeam: { name: 'St. Louis Cardinals', abbreviation: 'STL' }, date: '2026-03-15', time: '20:05', leagueId: 'mlb', sport: 'mlb', status: 'scheduled', venue: 'Wrigley Field' },
];

export const MOCK_NHL_MATCHES: Match[] = [
  { id: 'nhl-1', homeTeam: { name: 'Toronto Maple Leafs', abbreviation: 'TOR' }, awayTeam: { name: 'Montreal Canadiens', abbreviation: 'MTL' }, date: '2026-03-14', time: '19:00', leagueId: 'nhl', sport: 'nhl', status: 'scheduled', venue: 'Scotiabank Arena' },
  { id: 'nhl-2', homeTeam: { name: 'Colorado Avalanche', abbreviation: 'COL' }, awayTeam: { name: 'Vegas Golden Knights', abbreviation: 'VGK' }, date: '2026-03-14', time: '21:00', leagueId: 'nhl', sport: 'nhl', status: 'scheduled', venue: 'Ball Arena' },
  { id: 'nhl-3', homeTeam: { name: 'New York Rangers', abbreviation: 'NYR' }, awayTeam: { name: 'Tampa Bay Lightning', abbreviation: 'TBL' }, date: '2026-03-15', time: '19:00', leagueId: 'nhl', sport: 'nhl', status: 'scheduled', venue: 'Madison Square Garden' },
];

export const MOCK_NCAA_MATCHES: Match[] = [
  { id: 'ncaa-1', homeTeam: { name: 'Duke Blue Devils', abbreviation: 'DUKE' }, awayTeam: { name: 'Kansas Jayhawks', abbreviation: 'KU' }, date: '2026-03-14', time: '21:00', leagueId: 'ncaa', sport: 'ncaa', status: 'scheduled', venue: 'Cameron Indoor Stadium' },
  { id: 'ncaa-2', homeTeam: { name: 'Kentucky Wildcats', abbreviation: 'UK' }, awayTeam: { name: 'North Carolina Tar Heels', abbreviation: 'UNC' }, date: '2026-03-14', time: '19:00', leagueId: 'ncaa', sport: 'ncaa', status: 'scheduled', venue: 'Rupp Arena' },
  { id: 'ncaa-3', homeTeam: { name: 'Gonzaga Bulldogs', abbreviation: 'GONZ' }, awayTeam: { name: 'Houston Cougars', abbreviation: 'HOU' }, date: '2026-03-15', time: '20:00', leagueId: 'ncaa', sport: 'ncaa', status: 'scheduled', venue: 'McCarthey Athletic Center' },
];

// ============================================================
// MOCK PREDICTION POOLS — Per league/sport
// ============================================================
export const PREDICTION_POOLS: Record<string, Array<{ teamPick: string; matchId: string; summaries: string[] }>> = {
  'premier-league': [
    { teamPick: 'Arsenal', matchId: 'pl-1', summaries: ['Arsenal domina en casa con ventaja táctica clara sobre Chelsea.', 'Los Gunners tienen mejor forma reciente y solidez defensiva en el Emirates.', 'Ventaja local y profundidad de plantilla hacen de Arsenal el favorito claro.'] },
    { teamPick: 'Manchester City', matchId: 'pl-2', summaries: ['City en casa es prácticamente imbatible con su posesión y calidad.', 'Guardiola tiene el sistema perfecto para contrarrestar a Liverpool esta semana.', 'El control del mediocampo de City les da ventaja sobre un Liverpool inconstante.'] },
    { teamPick: 'Liverpool', matchId: 'pl-2', summaries: ['Liverpool viaja al Etihad con confianza tras 4 victorias seguidas.', 'La velocidad de ataque del Liverpool puede sorprender a la defensa de City.'] },
    { teamPick: 'Newcastle', matchId: 'pl-4', summaries: ['Newcastle aprovecha su fortaleza en casa ante un Villa irregular fuera.', 'St. James es una fortaleza: Newcastle tiene la mejor racha como local esta temporada.'] },
  ],
  'laliga': [
    { teamPick: 'Real Madrid', matchId: 'll-1', summaries: ['Real Madrid en el Bernabéu es el pick más sólido del fútbol europeo.', 'La experiencia y calidad del Madrid los hace favoritos claros en el clásico.', 'Mbappé en plena forma hace que el Bernabéu sea un territorio hostil para el Barça.'] },
    { teamPick: 'FC Barcelona', matchId: 'll-1', summaries: ['Barcelona viaja con confianza al Bernabéu con su mejor versión colectiva.', 'El sistema de Flick ha resuelto las debilidades defensivas del Barça esta temporada.'] },
    { teamPick: 'Atlético Madrid', matchId: 'll-2', summaries: ['Atleti en casa es un equipo diferente, con solidez defensiva top de Europa.', 'El Metropolitano da una ventaja enorme a Simeone ante un Sevilla en crisis.'] },
  ],
  'serie-a': [
    { teamPick: 'Inter Milan', matchId: 'sa-1', summaries: ['Inter es el equipo más completo de Italia, favorito claro en el derbi.', 'La gestión táctica de Inzaghi y el colectivo de Inter supera a un Milan irregular.', 'Inter tiene la mejor defensa de la liga, clave para el derbi de Milán.'] },
    { teamPick: 'Napoli', matchId: 'sa-2', summaries: ['Napoli en plena resurrección, con energía y motivación extra ante la Juventus.', 'El ataque del Napoli ha sido letal fuera de casa en los últimos 3 partidos.'] },
    { teamPick: 'Roma', matchId: 'sa-3', summaries: ['Roma en el Olímpico tiene ventaja histórica en el derbi ante Lazio.', 'El derby della Capitale en casa inclina la balanza hacia la Roma esta jornada.'] },
  ],
  'bundesliga': [
    { teamPick: 'Bayern Munich', matchId: 'bl-1', summaries: ['Bayern en casa es el mejor equipo de Alemania por amplísimo margen.', 'La Allianz Arena convierte cada clásico alemán en una victoria de Bayern.', 'La profundidad de plantilla y el nivel de Kane hacen a Bayern favorito claro.'] },
    { teamPick: 'Bayer Leverkusen', matchId: 'bl-2', summaries: ['Leverkusen mantiene la racha invicta más espectacular del fútbol europeo.', 'La energía y el sistema de Xabi Alonso hacen de Leverkusen el pick del día.'] },
  ],
  'ligue-1': [
    { teamPick: 'Paris SG', matchId: 'l1-1', summaries: ['PSG en casa ante el Marseille es el partido más unilateral de la liga.', 'La calidad individual del PSG es insuperable en la Ligue 1 esta temporada.', 'El Parque de los Príncipes nunca perdona al Marsella en estos clásicos.'] },
    { teamPick: 'Monaco', matchId: 'l1-2', summaries: ['Monaco en casa aprovecha su velocidad de transición ante un Lens cansado.', 'El Louis II potencia a un Monaco que viene de 3 victorias seguidas.'] },
  ],
  'champions-league': [
    { teamPick: 'Real Madrid', matchId: 'ucl-1', summaries: ['Real Madrid en Champions tiene un historial incomparable de remontadas épicas.', 'El Bernabéu convierte a Madrid en el favorito indiscutible en Europa.', 'La experiencia de Madrid en eliminatorias es un factor decisivo.'] },
    { teamPick: 'Bayern Munich', matchId: 'ucl-2', summaries: ['Bayern tiene el ataque más poderoso del torneo para superar a Arsenal.', 'En casa, Bayern es una máquina eficiente que Arsenal difícilmente puede parar.'] },
  ],
  'nba': [
    { teamPick: 'Los Angeles Lakers', matchId: 'nba-1', summaries: ['LeBron y AD en casa tienen la experiencia para superar a los Celtics.', 'Los Lakers aprovechan el factor Crypto.com Arena en este partido clave.'] },
    { teamPick: 'Boston Celtics', matchId: 'nba-1', summaries: ['Boston es el equipo más consistente de la NBA esta temporada, favorito claro.', 'La defensa de los Celtics es el mejor arma ante un Lakers dependiente de LeBron.'] },
    { teamPick: 'Denver Nuggets', matchId: 'nba-2', summaries: ['Jokic como MVP hace a Denver el equipo más difícil de parar en la liga.', 'Denver en carretera sigue siendo una amenaza real con el nivel de Nikola.'] },
  ],
  'nfl': [
    { teamPick: 'Kansas City Chiefs', matchId: 'nfl-1', summaries: ['Los Chiefs con Mahomes en casa son prácticamente imbatibles en playoffs.', 'Arrowhead Stadium y Mahomes son la combinación más letal del fútbol americano.', 'La experiencia de postemporada de KC hace la diferencia ante un buen SF.'] },
    { teamPick: 'Dallas Cowboys', matchId: 'nfl-2', summaries: ['Cowboys en el AT&T Stadium tienen ventaja táctica clara sobre los Eagles.', 'La defensa de Dallas ha encontrado su mejor versión justo antes de playoffs.'] },
  ],
  'mlb': [
    { teamPick: 'New York Yankees', matchId: 'mlb-1', summaries: ['Los Yankees en casa son siempre favoritos ante el rival histórico Boston.', 'El bullpen de New York es el más sólido de la liga en este momento.'] },
    { teamPick: 'Los Angeles Dodgers', matchId: 'mlb-2', summaries: ['Dodger Stadium y el nivel de la rotación hacen a LA favorito claro.', 'Los Dodgers tienen el mejor récord en casa de toda la Liga Nacional.'] },
  ],
  'nhl': [
    { teamPick: 'Toronto Maple Leafs', matchId: 'nhl-1', summaries: ['Toronto en Scotiabank Arena con su potente primera línea ofensiva.', 'Los Leafs tienen la racha local más sólida de la conferencia este mes.'] },
    { teamPick: 'Colorado Avalanche', matchId: 'nhl-2', summaries: ['Colorado con MacKinnon tiene el ataque más letal de la liga este año.', 'La energía de Ball Arena y la calidad de Avalanche los hace favoritos.'] },
  ],
  'ncaa': [
    { teamPick: 'Ohio State Buckeyes', matchId: 'ncaa-2', summaries: ['Ohio State tiene ventaja local y plantilla superior ante un Michigan irregular.', 'El Ohio Stadium con 100.000 aficionados es el factor decisivo del día.'] },
    { teamPick: 'Alabama Crimson Tide', matchId: 'ncaa-1', summaries: ['Alabama en casa es un equipo diferente con una ventaja táctica clara.', 'El sistema de Saban sigue siendo el más efectivo del fútbol universitario.'] },
  ],
};

// ============================================================
// ANALYTICS MOCK DATA — Performance over last 10 days
// ============================================================
export const ANALYTICS_DATA = [
  { dia: 'D-9', ChatGPT: 60, Gemini: 65, Claude: 55, Qwen: 50, Perplexity: 62 },
  { dia: 'D-8', ChatGPT: 65, Gemini: 68, Claude: 58, Qwen: 54, Perplexity: 65 },
  { dia: 'D-7', ChatGPT: 63, Gemini: 70, Claude: 60, Qwen: 52, Perplexity: 67 },
  { dia: 'D-6', ChatGPT: 67, Gemini: 69, Claude: 62, Qwen: 56, Perplexity: 66 },
  { dia: 'D-5', ChatGPT: 65, Gemini: 71, Claude: 59, Qwen: 58, Perplexity: 68 },
  { dia: 'D-4', ChatGPT: 68, Gemini: 73, Claude: 61, Qwen: 60, Perplexity: 69 },
  { dia: 'D-3', ChatGPT: 66, Gemini: 72, Claude: 65, Qwen: 59, Perplexity: 70 },
  { dia: 'D-2', ChatGPT: 69, Gemini: 71, Claude: 63, Qwen: 62, Perplexity: 71 },
  { dia: 'D-1', ChatGPT: 68, Gemini: 71, Claude: 67, Qwen: 64, Perplexity: 70 },
  { dia: 'Hoy', ChatGPT: 68.5, Gemini: 71.2, Claude: 66.8, Qwen: 64.3, Perplexity: 69.7 },
];

export const SPORT_ACCURACY_DATA = [
  { deporte: 'Fútbol', ChatGPT: 70, Gemini: 73, Claude: 68, Qwen: 65, Perplexity: 71 },
  { deporte: 'NBA', ChatGPT: 67, Gemini: 70, Claude: 65, Qwen: 62, Perplexity: 69 },
  { deporte: 'NFL', ChatGPT: 65, Gemini: 68, Claude: 64, Qwen: 60, Perplexity: 67 },
  { deporte: 'MLB', ChatGPT: 64, Gemini: 67, Claude: 63, Qwen: 59, Perplexity: 66 },
  { deporte: 'NHL', ChatGPT: 66, Gemini: 69, Claude: 65, Qwen: 61, Perplexity: 68 },
  { deporte: 'NCAA', ChatGPT: 63, Gemini: 66, Claude: 62, Qwen: 58, Perplexity: 65 },
];
