// ============================================================
// TIPOS GLOBALES - AI Sports Analysis Arena
// ============================================================

export type Sport = 'football' | 'nba' | 'nfl' | 'mlb' | 'nhl' | 'ncaa';
export type AnalysisStatus = 'idle' | 'loading' | 'complete' | 'error';

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  color: string;
  accuracy: number;
  totalPicks: number;
  correctPicks: number;
  currentStreak: number;
  heatmap: (boolean | null)[];
  rank: number;
  // 🔌 Ready for backend: inject API credentials from env
  apiEndpoint?: string;
}

export interface Team {
  name: string;
  abbreviation: string;
}

export interface Match {
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

export interface AIPrediction {
  modelId: string;
  teamPick: string;
  probability: number;
  summary: string;
  matchId?: string;
}

export interface ConsensusPick {
  teamPick: string;
  count: number;
  models: string[];
  avgProbability: number;
}

export interface League {
  id: string;
  name: string;
  shortName: string;
  country: string;
  flag: string;
  sport: Sport;
  currentMatchday?: number;
  season?: string;
}

export interface SportConfig {
  id: Sport;
  name: string;
  emoji: string;
  path: string;
  color: string;
}

// ============================================================
// BACKEND CONTRACT — Replace mocks with real fetch calls
// ============================================================

export interface SportsbookAPIConfig {
  // API-Football: https://www.api-football.com/
  footballApiKey?: string;
  footballApiBase?: string;
  // The Odds API: https://the-odds-api.com/
  oddsApiKey?: string;
  oddsApiBase?: string;
}

export interface AIApiConfig {
  // OpenAI — ChatGPT
  openAIKey?: string;
  // Google — Gemini
  googleAIKey?: string;
  // Anthropic — Claude
  anthropicKey?: string;
  // Alibaba — Qwen
  qwenApiKey?: string;
  // Perplexity
  perplexityKey?: string;
}

export interface BackendConfig {
  // NestJS backend base URL
  backendUrl?: string;
  sports: SportsbookAPIConfig;
  ai: AIApiConfig;
}
