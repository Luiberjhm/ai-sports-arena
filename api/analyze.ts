import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * ============================================================
 * VERCEL FUNCTION — AI Analysis Proxy
 * ============================================================
 * POST /api/analyze
 * Body: { model: 'chatgpt' | 'gemini' | 'claude' | 'llama' | 'mistral', payload: AnalysisPayload }
 *
 * Routes server-side to the correct AI API so keys are never
 * exposed to the browser.
 * ============================================================
 */

const SYSTEM_PROMPT = `You are a professional sports analyst specialized in probabilistic prediction.

Analyze the sports matchday provided and identify the single best bet — the team with the highest probability of winning.

Your analysis must consider:
• Relative team strength and current form
• Home advantage
• Recent results and momentum
• Historical head-to-head performance

Rules:
1. Select ONE team (home or away) with the highest winning probability.
2. Estimate probability as an integer between 65 and 92.
3. Provide a concise explanation in 25 words or less.
4. Do NOT invent specific statistics or scores.

Respond ONLY with valid JSON (no markdown, no extra text):
{"team_pick": "Team Name", "probability": 78, "summary": "Brief reason"}`;

function buildUserPrompt(payload: any): string {
  const matchList = (payload.matches as any[])
    .map((m, i) =>
      `${i + 1}. ${m.homeTeam} vs ${m.awayTeam} (${m.date} ${m.time}${m.venue ? ' @ ' + m.venue : ''})`
    )
    .join('\n');

  return `Sport: ${payload.sport}
League: ${payload.league}
Matchday: ${payload.matchday}

Upcoming matches:
${matchList}

Pick the single strongest bet. Respond with JSON only.`;
}

// ── OpenAI-compatible caller (ChatGPT, Groq, Mistral) ──────────────────────
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
      max_tokens: 150,
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
      generationConfig: { maxOutputTokens: 150, temperature: 0.3 },
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
      max_tokens: 150,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);
  return data.content[0].text;
}

// ── JSON parser (handles markdown code blocks from some models) ────────────
function parseResponse(text: string): { team_pick: string; probability: number; summary: string } {
  const jsonMatch = text.match(/\{[\s\S]*?\}/);
  if (!jsonMatch) throw new Error(`No JSON in response: ${text.substring(0, 100)}`);
  const parsed = JSON.parse(jsonMatch[0]);
  if (!parsed.team_pick || parsed.probability == null || !parsed.summary) {
    throw new Error('Incomplete JSON fields');
  }
  return {
    team_pick: String(parsed.team_pick).trim(),
    probability: typeof parsed.probability === 'number' ? parsed.probability : parseInt(parsed.probability, 10),
    summary: String(parsed.summary).trim(),
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
    console.log(`✅ [analyze/${model}] → ${parsed.team_pick} (${parsed.probability}%)`);

    return res.status(200).json({
      modelId:   model,
      teamPick:  parsed.team_pick,
      probability: parsed.probability,
      summary:   parsed.summary,
    });

  } catch (err: any) {
    console.error(`🛑 [analyze/${model}]:`, err.message);
    return res.status(502).json({ error: err.message || 'AI call failed' });
  }
}
