/**
 * ============================================================
 * AI SERVICE — AI Sports Analysis Arena
 * ============================================================
 * 
 * 🔌 BACKEND CONNECTION READY
 * 
 * To connect to real backend (NestJS):
 * 1. Set VITE_BACKEND_URL in your .env file
 * 2. Replace the mock implementation below with real fetch calls
 * 3. Your NestJS backend receives the request and calls:
 *    - OpenAI API (ChatGPT)
 *    - Google Generative AI (Gemini)
 *    - Anthropic API (Claude)
 *    - Alibaba Cloud (Qwen)
 *    - Perplexity API
 * 
 * Real implementation example:
 * 
 * async function analyzeMatchday(payload: AnalysisPayload): Promise<PredictionMap> {
 *   const response = await fetch(`${BACKEND_URL}/api/analyze`, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(payload),
 *   });
 *   return response.json();
 * }
 */

import { AIPrediction, Match, League } from '../types';
import { AI_MODELS, PREDICTION_POOLS } from '../data/mockData';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || null;

// ============================================================
// SYSTEM PROMPT — Permanent, never changes
// ============================================================
const SYSTEM_PROMPT = `You are a professional sports analyst specialized in probabilistic prediction.

Your role is to analyze sports matchups and identify the team with the highest probability of winning in the selected league matchday.

Your analysis must consider:
• Relative team strength
• Recent form
• Tactical advantage
• Home vs away performance
• Squad depth
• Momentum trends

Rules:
1. Select ONE team with the highest probability of winning in the matchday.
2. Estimate probability between 70% and 90%.
3. Provide a concise explanation (maximum 30 words).
4. Do not invent statistics.

Output JSON: { "team_pick": "", "probability": "", "summary": "" }`;

// ============================================================
// ANALYSIS PAYLOAD — Sent to backend/AI models
// ============================================================
export interface AnalysisPayload {
  systemPrompt: string;
  sport: string;
  league: string;
  matchday: number | string;
  matches: Array<{
    homeTeam: string;
    awayTeam: string;
    date: string;
    time: string;
    venue?: string;
  }>;
}

export type PredictionMap = Record<string, AIPrediction>;

// ============================================================
// BUILD PAYLOAD — Creates the analysis payload
// ============================================================
export function buildAnalysisPayload(matches: Match[], league: League | null): AnalysisPayload {
  return {
    systemPrompt: SYSTEM_PROMPT,
    sport: league?.sport || 'football',
    league: league?.name || 'Unknown League',
    matchday: league?.currentMatchday || 'current',
    matches: matches.map(m => ({
      homeTeam: m.homeTeam.name,
      awayTeam: m.awayTeam.name,
      date: m.date,
      time: m.time,
      venue: m.venue,
    })),
  };
}

// ============================================================
// MOCK PREDICTION GENERATOR
// ============================================================
function generateMockPrediction(
  modelId: string,
  leagueId: string,
  matches: Match[],
  modelIndex: number
): AIPrediction {
  const pool = PREDICTION_POOLS[leagueId] || PREDICTION_POOLS['premier-league'];

  if (!pool || pool.length === 0) {
    const randomMatch = matches[Math.floor(Math.random() * matches.length)];
    const isHome = Math.random() > 0.4;
    const team = isHome ? randomMatch.homeTeam.name : randomMatch.awayTeam.name;
    return {
      modelId,
      teamPick: team,
      probability: Math.floor(Math.random() * 21) + 70,
      summary: `Análisis estadístico sugiere a ${team} como el pick más sólido de la jornada.`,
      matchId: randomMatch.id,
    };
  }

  // Bias: first 3 models tend to agree (consensus simulation)
  const pickIndex = modelIndex < 3
    ? 0  // First picks align for consensus
    : Math.min(modelIndex - 2, pool.length - 1);

  const pick = pool[Math.min(pickIndex, pool.length - 1)];
  const summaryIndex = modelIndex % pick.summaries.length;

  return {
    modelId,
    teamPick: pick.teamPick,
    probability: Math.floor(Math.random() * 16) + 72, // 72-87%
    summary: pick.summaries[summaryIndex],
    matchId: pick.matchId,
  };
}

// ============================================================
// SIMULATE SINGLE AI CALL — With realistic delay
// ============================================================
async function simulateAICall(
  modelId: string,
  leagueId: string,
  matches: Match[],
  modelIndex: number
): Promise<AIPrediction> {
  // Simulate different response times per model
  const delays: Record<string, number> = {
    gemini: 800,
    chatgpt: 1200,
    perplexity: 1500,
    claude: 1900,
    qwen: 2300,
  };

  const delay = (delays[modelId] || 1500) + Math.random() * 400;
  
  await new Promise(resolve => setTimeout(resolve, delay));
  
  return generateMockPrediction(modelId, leagueId, matches, modelIndex);
}

// ============================================================
// MAIN ANALYZE FUNCTION — Calls all 5 AI models
// ============================================================
export async function analyzeMatchday(
  matches: Match[],
  league: League | null,
  onModelComplete?: (modelId: string, prediction: AIPrediction) => void
): Promise<PredictionMap> {
  if (matches.length === 0) {
    throw new Error('No hay partidos disponibles para analizar');
  }

  const leagueId = league?.id || 'premier-league';

  // 🔌 REAL BACKEND: Uncomment when backend is ready
  // if (BACKEND_URL) {
  //   const payload = buildAnalysisPayload(matches, league);
  //   const response = await fetch(`${BACKEND_URL}/api/analyze`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(payload),
  //   });
  //   if (!response.ok) throw new Error('Backend error');
  //   return response.json();
  // }

  // MOCK: Simulate all 5 AI calls simultaneously
  const predictions: PredictionMap = {};

  const promises = AI_MODELS.map((model, index) =>
    simulateAICall(model.id, leagueId, matches, index).then(prediction => {
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

  const sorted = Object.entries(counts)
    .sort(([, a], [, b]) => b.count - a.count);

  if (sorted.length === 0) return null;

  const [teamPick, data] = sorted[0];

  return {
    teamPick,
    count: data.count,
    models: data.models,
    avgProbability: Math.round(data.totalProb / data.count),
    hasConsensus: data.count >= 3,
  };
}
