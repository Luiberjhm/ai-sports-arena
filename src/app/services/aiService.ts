/**
 * ============================================================
 * AI SERVICE — AI Sports Analysis Arena
 * ============================================================
 *
 * Calls /api/analyze (Vercel Function) for each of the 5 models.
 * The Function handles all AI API keys server-side.
 *
 * Flow:
 *   Browser → POST /api/analyze?model=chatgpt → Vercel Fn → OpenAI → AIPrediction
 *
 * Fallback:
 *   If the API call fails, a mock prediction is generated so the
 *   UI never breaks — but a console warning is shown.
 * ============================================================
 */

import { AIPrediction, Match, League } from '../types';
import { AI_MODELS, PREDICTION_POOLS } from '../data/mockData';

// ============================================================
// ANALYSIS PAYLOAD — Sent to /api/analyze
// ============================================================
export interface AnalysisPayload {
  systemPrompt?: string; // reserved, not sent (prompt lives server-side)
  sport:     string;
  league:    string;
  matchday:  number | string;
  matches: Array<{
    homeTeam: string;
    awayTeam: string;
    date:     string;
    time:     string;
    venue?:   string;
  }>;
}

export type PredictionMap = Record<string, AIPrediction>;

// ============================================================
// BUILD PAYLOAD
// ============================================================
export function buildAnalysisPayload(matches: Match[], league: League | null): AnalysisPayload {
  return {
    sport:    league?.sport || 'football',
    league:   league?.name  || 'Unknown League',
    matchday: league?.currentMatchday || 'current',
    matches:  matches.map(m => ({
      homeTeam: m.homeTeam.name,
      awayTeam: m.awayTeam.name,
      date:     m.date,
      time:     m.time,
      venue:    m.venue,
    })),
  };
}

// ============================================================
// MOCK FALLBACK (only used when /api/analyze fails)
// ============================================================
function generateMockPrediction(
  modelId:    string,
  leagueId:   string,
  matches:    Match[],
  modelIndex: number
): AIPrediction {
  const pool = PREDICTION_POOLS[leagueId] || PREDICTION_POOLS['premier-league'];

  if (!pool || pool.length === 0) {
    const m    = matches[Math.floor(Math.random() * matches.length)];
    const team = Math.random() > 0.4 ? m.homeTeam.name : m.awayTeam.name;
    return {
      modelId,
      teamPick:    team,
      probability: Math.floor(Math.random() * 21) + 70,
      summary:     `Análisis estadístico sugiere a ${team} como el pick más sólido de la jornada.`,
      matchId:     m.id,
    };
  }

  const pickIndex = modelIndex < 3 ? 0 : Math.min(modelIndex - 2, pool.length - 1);
  const pick      = pool[Math.min(pickIndex, pool.length - 1)];

  return {
    modelId,
    teamPick:    pick.teamPick,
    probability: Math.floor(Math.random() * 16) + 72,
    summary:     pick.summaries[modelIndex % pick.summaries.length],
    matchId:     pick.matchId,
  };
}

// ============================================================
// REAL AI CALL — POST /api/analyze
// ============================================================
async function callAnalyzeAPI(
  modelId:    string,
  payload:    AnalysisPayload,
  leagueId:   string,
  matches:    Match[],
  modelIndex: number
): Promise<AIPrediction> {
  try {
    const res = await fetch('/api/analyze', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ model: modelId, payload }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    const data = await res.json();

    // Validate required fields
    if (!data.teamPick || data.probability == null || !data.summary) {
      throw new Error('Incomplete response from /api/analyze');
    }

    // Find matchId by matching team name to a match in the list
    const matchId =
      matches.find(
        m =>
          m.homeTeam.name === data.teamPick ||
          m.awayTeam.name === data.teamPick
      )?.id || matches[0]?.id || '';

    console.log(`✅ [${modelId}] → ${data.teamPick} (${data.probability}%) | ${data.betMarket || '?'} | Risk: ${data.riskLevel || '?'}`);

    return {
      modelId,
      teamPick:        data.teamPick,
      probability:     data.probability,
      summary:         data.summary,
      matchId,
      confidenceLevel: data.confidenceLevel,
      riskLevel:       data.riskLevel,
      betMarket:       data.betMarket,
      analysis:        data.analysis,
    };

  } catch (err: any) {
    console.warn(`⚠️ [${modelId}] API failed — using mock fallback:`, err.message);
    return generateMockPrediction(modelId, leagueId, matches, modelIndex);
  }
}

// ============================================================
// MAIN ANALYZE FUNCTION — Calls all 5 AI models in parallel
// ============================================================
export async function analyzeMatchday(
  matches:         Match[],
  league:          League | null,
  onModelComplete?: (modelId: string, prediction: AIPrediction) => void
): Promise<PredictionMap> {
  if (matches.length === 0) {
    throw new Error('No hay partidos disponibles para analizar');
  }

  const leagueId = league?.id || 'premier-league';
  const payload  = buildAnalysisPayload(matches, league);
  const predictions: PredictionMap = {};

  const promises = AI_MODELS.map((model, index) =>
    callAnalyzeAPI(model.id, payload, leagueId, matches, index).then(prediction => {
      predictions[model.id] = prediction;
      onModelComplete?.(model.id, prediction);
      return prediction;
    })
  );

  await Promise.all(promises);
  return predictions;
}

// ============================================================
// CONSENSUS CALCULATOR
// ============================================================
export function calculateConsensus(predictions: PredictionMap) {
  const counts: Record<string, { count: number; models: string[]; totalProb: number }> = {};

  Object.entries(predictions).forEach(([modelId, pred]) => {
    if (!counts[pred.teamPick]) {
      counts[pred.teamPick] = { count: 0, models: [], totalProb: 0 };
    }
    counts[pred.teamPick].count++;
    counts[pred.teamPick].models.push(modelId);
    counts[pred.teamPick].totalProb += pred.probability;
  });

  const sorted = Object.entries(counts).sort(([, a], [, b]) => b.count - a.count);
  if (sorted.length === 0) return null;

  const [teamPick, data] = sorted[0];

  // Most common betMarket among models that picked this team
  const marketVotes: Record<string, number> = {};
  const riskVotes: Record<string, number> = {};
  data.models.forEach(modelId => {
    const pred = predictions[modelId];
    if (pred?.betMarket) marketVotes[pred.betMarket] = (marketVotes[pred.betMarket] || 0) + 1;
    if (pred?.riskLevel) riskVotes[pred.riskLevel]   = (riskVotes[pred.riskLevel]   || 0) + 1;
  });

  const topMarket = Object.entries(marketVotes).sort(([, a], [, b]) => b - a)[0]?.[0];
  const topRisk   = Object.entries(riskVotes).sort(([, a], [, b]) => b - a)[0]?.[0];

  return {
    teamPick,
    count:          data.count,
    models:         data.models,
    avgProbability: Math.round(data.totalProb / data.count),
    hasConsensus:   data.count >= 3,
    betMarket:      topMarket,
    riskLevel:      topRisk,
  };
}
