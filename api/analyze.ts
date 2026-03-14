import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * ============================================================
 * VERCEL FUNCTION — AI Analysis Proxy
 * ============================================================
 * POST /api/analyze
 * Body: { model: 'chatgpt' | 'gemini' | 'claude' | 'llama' | 'mistral', payload }
 * ============================================================
 */

// ── Definitive System Prompt ───────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an elite sports betting analyst and data scientist specialized in probabilistic prediction for professional sports competitions.

Your role combines:
• Sports analytics and team performance evaluation
• Betting market analysis and value identification
• Risk assessment for intermediate-level bettors

You think like a professional quant analyst at a top sportsbook.

MISSION
Analyze all scheduled matches in the given matchday.
Select the ONE bet with the clearest, most multi-dimensional statistical advantage. Your pick must be the most defensible bet of the entire matchday.

MANDATORY ANALYTICAL PROCESS (follow in order)

Step 1 — Evaluate EACH match independently across 4 dimensions:
  • TEAM STRENGTH: Squad quality, depth, player caliber, league position
  • MOMENTUM: Recent form trend, scoring consistency, defensive stability
  • TACTICAL EDGE: Style matchup, attacking vs defensive compatibility
  • CONTEXT: Home/away advantage, fixture importance, competitive pressure

Step 2 — Compare ALL evaluated matchups.
  Identify which match has the CLEAREST one-sided advantage.
  Your pick must be justified relative to the ENTIRE matchday.

Step 3 — Define the optimal betting market:
  Choose the market that best captures the identified advantage:
  • "Match Winner" — clear favorite with dominant advantage
  • "Double Chance" — strong team but opponent offers resistance
  • "Over 2.5 Goals" — high-scoring profile on both sides
  • "Under 2.5 Goals" — defensive profile, low-scoring context

PROBABILITY CALIBRATION
• 85–90%: Overwhelming dominance across all 4 dimensions
• 75–84%: Clear advantage in 3+ dimensions
• 70–74%: Favored but with meaningful competitive resistance
• Never assign > 90% — sports are inherently unpredictable

RISK CALIBRATION
• Low: 3–4 dimensions clearly favor the pick
• Medium: 2–3 dimensions favor the pick, one factor is uncertain
• High: Pick is based on 1–2 dominant factors, real upset risk exists

STRICT RULES
1. Select ONLY ONE team and ONE betting market for the entire matchday.
2. Probability must be an integer between 70 and 90.
3. Base analysis on general team knowledge, tactical patterns, and historical competitive tendencies.
4. Do NOT cite specific match scores, exact statistics, injury reports, or real-time data — reason from principles and general knowledge.
5. Each analysis field: one sentence, maximum 15 words.
6. Summary: maximum 30 words, betting-focused, actionable.

LANGUAGE
All text values in the JSON response must be written in Spanish. Team names remain in their original language.

OUTPUT
Output ONLY raw JSON. No markdown. No code blocks. No text before or after.
Start your response with { and end with }.

{"team_pick":"Team Name","probability":82,"confidence_level":"High","risk_level":"Low","bet_market":"Match Winner","analysis":{"team_strength":"One sentence max 15 words.","momentum":"One sentence max 15 words.","tactical_edge":"One sentence max 15 words.","context":"One sentence max 15 words."},"summary":"Max 30 words actionable betting-focused justification."}`;

// ── Dynamic user prompt ────────────────────────────────────────────────────
function buildUserPrompt(payload: any): string {
  const matchList = (payload.matches as any[])
    .map((m, i) => {
      const venue = m.venue ? ` @ ${m.venue}` : '';
      return `${i + 1}. ${m.homeTeam} (Home) vs ${m.awayTeam} (Away) — ${m.date} ${m.time}${venue}`;
    })
    .join('\n');

  return `Sport: ${payload.sport}
League: ${payload.league}
Matchday: ${payload.matchday}

Scheduled matches:
${matchList}

Evaluate ALL matches. Select the single strongest bet of this matchday.
Target: intermediate bettor seeking one clear, low-ambiguity recommendation.`;
}

// ── OpenAI-compatible caller (ChatGPT, Groq, Mistral) ─────────────────────
async function callOpenAICompat(
  userPrompt: string,
  apiKey: string,
  baseUrl: string,
  model: string
): Promise<string> {
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 350,
      temperature: 0.3,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);
  return data.choices[0].message.content;
}

// ── Google Gemini ──────────────────────────────────────────────────────────
async function callGemini(userPrompt: string, apiKey: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\n${userPrompt}` }] }],
      generationConfig: { maxOutputTokens: 350, temperature: 0.3 },
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);
  return data.candidates[0].content.parts[0].text;
}

// ── Anthropic Claude ───────────────────────────────────────────────────────
async function callAnthropic(userPrompt: string, apiKey: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 350,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);
  return data.content[0].text;
}

// ── JSON parser ────────────────────────────────────────────────────────────
interface ParsedResponse {
  team_pick: string;
  probability: number;
  confidence_level?: string;
  risk_level?: string;
  bet_market?: string;
  analysis?: {
    team_strength?: string;
    momentum?: string;
    tactical_edge?: string;
    context?: string;
  };
  summary: string;
}

function parseResponse(text: string): ParsedResponse {
  // Strip markdown code blocks if present
  const cleaned = text.replace(/```(?:json)?\s*/g, '').replace(/```\s*/g, '').trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`No JSON found in response: ${text.substring(0, 120)}`);
  const parsed = JSON.parse(jsonMatch[0]);
  if (!parsed.team_pick || parsed.probability == null || !parsed.summary) {
    throw new Error('Incomplete JSON fields (team_pick, probability, summary required)');
  }
  return {
    team_pick:        String(parsed.team_pick).trim(),
    probability:      typeof parsed.probability === 'number' ? parsed.probability : parseInt(parsed.probability, 10),
    confidence_level: parsed.confidence_level || undefined,
    risk_level:       parsed.risk_level || undefined,
    bet_market:       parsed.bet_market || undefined,
    analysis:         parsed.analysis || undefined,
    summary:          String(parsed.summary).trim(),
  };
}

// ── Handler ────────────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { model, payload } = req.body || {};

  if (!model || !payload) {
    return res.status(400).json({ error: 'Missing model or payload' });
  }
  if (!Array.isArray(payload.matches) || payload.matches.length === 0) {
    return res.status(400).json({ error: 'No matches in payload' });
  }

  const userPrompt = buildUserPrompt(payload);

  try {
    let rawText: string;

    switch (model) {
      case 'chatgpt': {
        const key = process.env.OPENAI_API_KEY;
        if (!key) throw new Error('OPENAI_API_KEY not configured');
        rawText = await callOpenAICompat(userPrompt, key, 'https://api.openai.com/v1', 'gpt-4o-mini');
        break;
      }
      case 'gemini': {
        const key = process.env.GEMINI_API_KEY;
        if (!key) throw new Error('GEMINI_API_KEY not configured');
        rawText = await callGemini(userPrompt, key);
        break;
      }
      case 'claude': {
        const key = process.env.ANTHROPIC_API_KEY;
        if (!key) throw new Error('ANTHROPIC_API_KEY not configured');
        rawText = await callAnthropic(userPrompt, key);
        break;
      }
      case 'llama': {
        const key = process.env.GROQ_API_KEY;
        if (!key) throw new Error('GROQ_API_KEY not configured');
        rawText = await callOpenAICompat(userPrompt, key, 'https://api.groq.com/openai/v1', 'llama-3.3-70b-versatile');
        break;
      }
      case 'mistral': {
        const key = process.env.MISTRAL_API_KEY;
        if (!key) throw new Error('MISTRAL_API_KEY not configured');
        rawText = await callOpenAICompat(userPrompt, key, 'https://api.mistral.ai/v1', 'mistral-small-latest');
        break;
      }
      default:
        return res.status(400).json({ error: `Unknown model: ${model}` });
    }

    const parsed = parseResponse(rawText);
    console.log(`✅ [analyze/${model}] → ${parsed.team_pick} (${parsed.probability}%) | ${parsed.bet_market || 'Match Winner'} | Risk: ${parsed.risk_level || '?'}`);

    return res.status(200).json({
      modelId:         model,
      teamPick:        parsed.team_pick,
      probability:     parsed.probability,
      confidenceLevel: parsed.confidence_level,
      riskLevel:       parsed.risk_level,
      betMarket:       parsed.bet_market,
      analysis:        parsed.analysis
        ? {
            teamStrength: parsed.analysis.team_strength || '',
            momentum:     parsed.analysis.momentum || '',
            tacticalEdge: parsed.analysis.tactical_edge || '',
            context:      parsed.analysis.context || '',
          }
        : undefined,
      summary: parsed.summary,
    });

  } catch (err: any) {
    console.error(`🛑 [analyze/${model}]:`, err.message);
    return res.status(502).json({ error: err.message || 'AI call failed' });
  }
}
