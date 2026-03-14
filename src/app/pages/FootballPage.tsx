import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Trophy, Zap, Activity } from 'lucide-react';
import { AICard } from '../components/shared/AICard';
import { RunButton } from '../components/shared/RunButton';
import { ConsensusPanel } from '../components/shared/ConsensusPanel';
import { MatchCard } from '../components/shared/MatchCard';
import { AI_MODELS, FOOTBALL_LEAGUES } from '../data/mockData';
import { analyzeMatchday, PredictionMap } from '../services/aiService';
import { getFootballMatchday } from '../services/sportsService';
import { AIPrediction, AnalysisStatus, League, Match } from '../types';

// ── localStorage helpers ─────────────────────────────────────────────────
const STORAGE_KEY = (leagueId: string) => `ai-arena-football-${leagueId}`;

function saveAnalysis(leagueId: string, predictions: PredictionMap) {
  try {
    localStorage.setItem(STORAGE_KEY(leagueId), JSON.stringify({
      predictions,
      savedAt: new Date().toISOString(),
    }));
  } catch { /* storage full or unavailable */ }
}

function loadAnalysis(leagueId: string): PredictionMap | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(leagueId));
    if (!raw) return null;
    const { predictions, savedAt } = JSON.parse(raw);
    // Only restore if saved today
    const today = new Date().toISOString().split('T')[0];
    if (savedAt?.startsWith(today)) return predictions as PredictionMap;
    localStorage.removeItem(STORAGE_KEY(leagueId));
    return null;
  } catch { return null; }
}

// ── Component ────────────────────────────────────────────────────────────
export function FootballPage() {
  const [selectedLeague, setSelectedLeague] = useState<League>(FOOTBALL_LEAGUES[0]);
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [predictions, setPredictions] = useState<PredictionMap>({});
  const [completedModels, setCompletedModels] = useState<Set<string>>(new Set());
  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [currentMatchday, setCurrentMatchday] = useState<number | undefined>(undefined);

  useEffect(() => {
    setLoadingMatches(true);
    setCurrentMatchday(undefined);

    // Restore saved analysis for this league (same day only)
    const saved = loadAnalysis(selectedLeague.id);
    if (saved && Object.keys(saved).length > 0) {
      setPredictions(saved);
      setCompletedModels(new Set(Object.keys(saved)));
      setStatus('complete');
    } else {
      setStatus('idle');
      setPredictions({});
      setCompletedModels(new Set());
    }

    getFootballMatchday(selectedLeague.id).then(result => {
      setMatches(result.matches);
      setCurrentMatchday(result.matches.find(m => m.matchday)?.matchday);
      setLoadingMatches(false);
    });
  }, [selectedLeague]);

  const handleRun = async () => {
    if (status === 'loading') return;
    setStatus('loading');
    setPredictions({});
    setCompletedModels(new Set());

    try {
      const finalPredictions: PredictionMap = {};
      await analyzeMatchday(matches, selectedLeague, (modelId, prediction) => {
        finalPredictions[modelId] = prediction;
        setPredictions(prev => ({ ...prev, [modelId]: prediction }));
        setCompletedModels(prev => new Set([...prev, modelId]));
      });
      setStatus('complete');
      saveAnalysis(selectedLeague.id, finalPredictions);
    } catch {
      setStatus('error');
    }
  };

  const modelStatus = (modelId: string): AnalysisStatus => {
    if (status === 'idle') return 'idle';
    if (completedModels.has(modelId)) return 'complete';
    return 'loading';
  };

  const getConsensusPick = () => {
    if (Object.keys(predictions).length === 0) return null;
    const counts: Record<string, number> = {};
    Object.values(predictions).forEach(p => {
      counts[p.teamPick] = (counts[p.teamPick] || 0) + 1;
    });
    const top = Object.entries(counts).sort(([, a], [, b]) => b - a)[0];
    return top?.[1] >= 3 ? top[0] : null;
  };

  const consensusPick = getConsensusPick();

  const getConsensusMatch = () => {
    if (!consensusPick || !predictions) return null;
    const pred = Object.values(predictions).find(p => p.teamPick === consensusPick);
    return pred?.matchId ? matches.find(m => m.id === pred.matchId) : null;
  };

  const consensusMatch = getConsensusMatch();

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0A' }}>
      {/* Page header */}
      <div
        className="sticky top-0 z-10 px-4 md:px-8 py-4"
        style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-3">
          <span style={{ fontSize: '24px' }}>⚽</span>
          <div>
            <h1 className="text-white" style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1.2 }}>
              Fútbol Europeo
            </h1>
            <p style={{ fontSize: '12px', color: '#555' }}>6 ligas · Análisis con 5 IAs</p>
          </div>
        </div>
      </div>

      {/* =============================================
          LEAGUE TABS — Top of page
         ============================================= */}
      <div
        style={{ background: '#0D0D0D', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: '72px', zIndex: 9 }}
      >
        <div className="px-4 md:px-8 overflow-x-auto">
          <div className="flex gap-1 py-3" style={{ minWidth: 'max-content' }}>
            {FOOTBALL_LEAGUES.map(league => {
              const isActive = league.id === selectedLeague.id;
              return (
                <button
                  key={league.id}
                  onClick={() => setSelectedLeague(league)}
                  className="flex items-center gap-2 rounded-xl px-4 py-2 transition-all"
                  style={{
                    background: isActive ? 'rgba(255,98,0,0.15)' : 'transparent',
                    border: isActive ? '1px solid rgba(255,98,0,0.35)' : '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{league.flag}</span>
                  <div className="text-left">
                    <p
                      style={{
                        fontSize: '12px',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? '#FF6200' : '#888',
                        lineHeight: 1.2,
                      }}
                    >
                      {league.name}
                    </p>
                    {isActive && (
                      <p style={{ fontSize: '10px', color: '#FF6200', opacity: 0.7 }}>
                        {currentMatchday ? `J${currentMatchday}` : 'Hoy'}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 py-6 space-y-6">

        {/* League header banner */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedLeague.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,98,0,0.1), rgba(255,98,0,0.03))',
              border: '1px solid rgba(255,98,0,0.2)',
            }}
          >
            {/* Decorative orb */}
            <div
              className="absolute right-0 top-0 w-40 h-40 rounded-full opacity-20"
              style={{
                background: 'radial-gradient(circle, #FF6200, transparent)',
                transform: 'translate(30%, -30%)',
              }}
            />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ fontSize: '28px' }}>{selectedLeague.flag}</span>
                    <div>
                      <h2 className="text-white" style={{ fontSize: '22px', fontWeight: 800, lineHeight: 1.2 }}>
                        {selectedLeague.name}
                      </h2>
                      <p style={{ fontSize: '12px', color: '#888' }}>
                        {selectedLeague.country} · {selectedLeague.season}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Trophy size={12} style={{ color: '#FF6200' }} />
                      <span style={{ fontSize: '12px', color: '#FF6200', fontWeight: 600 }}>
                        {currentMatchday ? `Jornada ${currentMatchday}` : 'Partidos del día'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} style={{ color: '#666' }} />
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {matches.length > 0 ? new Date(matches[0].date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : 'Próxima jornada'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Activity size={12} style={{ color: '#666' }} />
                      <span style={{ fontSize: '12px', color: '#666' }}>{matches.length} partidos</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Two column layout on desktop */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
          {/* LEFT: Matches + AI cards */}
          <div className="space-y-6">
            {/* RUN Button */}
            <div className="flex justify-center">
              <RunButton
                status={status}
                matchCount={matches.length}
                onRun={handleRun}
              />
            </div>

            {/* AI Cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white" style={{ fontSize: '14px', fontWeight: 700 }}>
                  Análisis de IAs
                </h3>
                <span style={{ fontSize: '11px', color: '#555' }}>5 modelos · {selectedLeague.name}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-3">
                {AI_MODELS.map(model => (
                  <AICard
                    key={model.id}
                    model={model}
                    status={modelStatus(model.id)}
                    prediction={predictions[model.id]}
                    isHighlighted={
                      status === 'complete' &&
                      predictions[model.id]?.teamPick === consensusPick
                    }
                  />
                ))}
              </div>
            </div>

            {/* Matches list */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white" style={{ fontSize: '14px', fontWeight: 700 }}>
                  Partidos de la Jornada
                </h3>
                {status === 'complete' && consensusPick && (
                  <div
                    className="flex items-center gap-1.5 rounded-full px-3 py-1"
                    style={{ background: 'rgba(255,98,0,0.15)', border: '1px solid rgba(255,98,0,0.3)' }}
                  >
                    <Zap size={10} style={{ color: '#FF6200' }} />
                    <span style={{ fontSize: '10px', color: '#FF6200', fontWeight: 600 }}>
                      Consenso: {consensusPick}
                    </span>
                  </div>
                )}
              </div>

              {loadingMatches ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="h-20 rounded-xl animate-pulse"
                      style={{ background: '#1C1C1C' }}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {matches.map(match => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      predictions={predictions}
                      status={status}
                      isConsensusPick={match.id === consensusMatch?.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Consensus + info panel */}
          <div className="space-y-4">
            <ConsensusPanel predictions={predictions} status={status} />

            {/* Quick Stats */}
            <div
              className="rounded-2xl p-4 space-y-3"
              style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <h4 className="text-white" style={{ fontSize: '13px', fontWeight: 700 }}>
                Estadísticas de IA · {selectedLeague.shortName}
              </h4>
              {AI_MODELS.map(model => (
                <div key={model.id} className="flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full shrink-0" style={{ background: model.color }} />
                  <span style={{ fontSize: '12px', color: '#888', flex: 1 }}>{model.name}</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${model.accuracy}%`, background: model.color }}
                    />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: model.color, width: '40px', textAlign: 'right' }}>
                    {model.accuracy}%
                  </span>
                </div>
              ))}
            </div>

            {/* How it works */}
            <div
              className="rounded-2xl p-4"
              style={{ background: 'rgba(255,98,0,0.05)', border: '1px solid rgba(255,98,0,0.15)' }}
            >
              <h4 style={{ fontSize: '12px', color: '#FF6200', fontWeight: 700, marginBottom: '10px', letterSpacing: '0.06em' }}>
                ¿CÓMO FUNCIONA?
              </h4>
              <div className="space-y-2">
                {[
                  { step: '1', text: 'El sistema carga los partidos de la jornada' },
                  { step: '2', text: 'Pulsas RUN para activar los 5 modelos' },
                  { step: '3', text: 'Cada IA analiza y selecciona su mejor pick' },
                  { step: '4', text: '≥3 IAs de acuerdo = Consenso confirmado' },
                ].map(item => (
                  <div key={item.step} className="flex items-start gap-2.5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: 'rgba(255,98,0,0.2)', border: '1px solid rgba(255,98,0,0.3)' }}
                    >
                      <span style={{ fontSize: '9px', color: '#FF6200', fontWeight: 700 }}>{item.step}</span>
                    </div>
                    <p style={{ fontSize: '11px', color: '#777', lineHeight: 1.5 }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
