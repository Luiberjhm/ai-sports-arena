import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Activity } from 'lucide-react';
import { AICard } from '../components/shared/AICard';
import { RunButton } from '../components/shared/RunButton';
import { ConsensusPanel } from '../components/shared/ConsensusPanel';
import { MatchCard } from '../components/shared/MatchCard';
import { AI_MODELS, SPORT_CONFIGS } from '../data/mockData';
import { analyzeMatchday, PredictionMap } from '../services/aiService';
import { getSportMatches } from '../services/sportsService';
import { AnalysisStatus, Match, Sport } from '../types';

interface SportsPageProps {
  sport: Sport;
}

export function SportsPage({ sport }: SportsPageProps) {
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [predictions, setPredictions] = useState<PredictionMap>({});
  const [completedModels, setCompletedModels] = useState<Set<string>>(new Set());
  const [matches, setMatches] = useState<Match[]>([]);

  const sportConfig = SPORT_CONFIGS.find(s => s.id === sport)!;

  const SPORT_INFO: Record<Sport, { league: string; description: string; matchday: string }> = {
    nba: { league: 'National Basketball Association', description: 'Regular Season 2025/26', matchday: 'Partidos del día' },
    nfl: { league: 'National Football League', description: 'Temporada 2025/26', matchday: 'Semana 18' },
    mlb: { league: 'Major League Baseball', description: 'Spring Training 2026', matchday: 'Partidos del día' },
    nhl: { league: 'National Hockey League', description: 'Regular Season 2025/26', matchday: 'Partidos del día' },
    ncaa: { league: 'NCAA Division I Football', description: 'Bowl Season 2025/26', matchday: 'Partidos del fin de semana' },
    football: { league: 'Fútbol Europeo', description: 'Varias ligas', matchday: 'Jornada actual' },
  };

  const info = SPORT_INFO[sport];

  useEffect(() => {
    setStatus('idle');
    setPredictions({});
    setCompletedModels(new Set());
    getSportMatches(sport).then(setMatches);
  }, [sport]);

  const handleRun = async () => {
    if (status === 'loading') return;
    setStatus('loading');
    setPredictions({});
    setCompletedModels(new Set());

    const mockLeague = {
      id: sport,
      name: info.league,
      shortName: sport.toUpperCase(),
      country: 'USA',
      flag: sportConfig.emoji,
      sport,
      currentMatchday: 18,
    };

    try {
      await analyzeMatchday(matches, mockLeague, (modelId, prediction) => {
        setPredictions(prev => ({ ...prev, [modelId]: prediction }));
        setCompletedModels(prev => new Set([...prev, modelId]));
      });
      setStatus('complete');
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

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0A' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 md:px-8 py-4"
        style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-3">
          <span style={{ fontSize: '26px' }}>{sportConfig.emoji}</span>
          <div>
            <h1 className="text-white" style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1.2 }}>
              {sportConfig.name}
            </h1>
            <p style={{ fontSize: '12px', color: '#555' }}>{info.league}</p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 py-6 space-y-6">
        {/* Hero banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${sportConfig.color}15, ${sportConfig.color}04)`,
            border: `1px solid ${sportConfig.color}30`,
          }}
        >
          <div
            className="absolute right-0 top-0 w-48 h-48 rounded-full opacity-15"
            style={{
              background: `radial-gradient(circle, ${sportConfig.color}, transparent)`,
              transform: 'translate(30%, -30%)',
            }}
          />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <span style={{ fontSize: '36px' }}>{sportConfig.emoji}</span>
              <div>
                <h2 className="text-white" style={{ fontSize: '24px', fontWeight: 800, lineHeight: 1.2 }}>
                  {info.league}
                </h2>
                <p style={{ fontSize: '13px', color: '#888' }}>{info.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5">
                <Calendar size={11} style={{ color: sportConfig.color }} />
                <span style={{ fontSize: '12px', color: sportConfig.color, fontWeight: 600 }}>
                  {info.matchday}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity size={11} style={{ color: '#666' }} />
                <span style={{ fontSize: '12px', color: '#666' }}>
                  {matches.length} partidos disponibles
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
          {/* LEFT */}
          <div className="space-y-6">
            {/* RUN */}
            <div className="flex justify-center">
              <RunButton status={status} matchCount={matches.length} onRun={handleRun} />
            </div>

            {/* AI Cards */}
            <div>
              <h3 className="text-white mb-3" style={{ fontSize: '14px', fontWeight: 700 }}>
                Análisis de IAs · {sportConfig.name}
              </h3>
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

            {/* Matches */}
            <div>
              <h3 className="text-white mb-3" style={{ fontSize: '14px', fontWeight: 700 }}>
                Partidos del Día
              </h3>
              <div className="space-y-3">
                {matches.map(match => {
                  const isConsensusMatch = status === 'complete' &&
                    consensusPick &&
                    Object.values(predictions).some(p => p.teamPick === consensusPick && p.matchId === match.id);

                  return (
                    <MatchCard
                      key={match.id}
                      match={match}
                      predictions={predictions}
                      status={status}
                      isConsensusPick={!!isConsensusMatch}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <ConsensusPanel predictions={predictions} status={status} />

            {/* AI accuracy for this sport */}
            <div
              className="rounded-2xl p-4 space-y-3"
              style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <h4 className="text-white" style={{ fontSize: '13px', fontWeight: 700 }}>
                Precisión IA · {sportConfig.name}
              </h4>
              {AI_MODELS.map(model => (
                <div key={model.id} className="flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full shrink-0" style={{ background: model.color }} />
                  <span style={{ fontSize: '12px', color: '#888', flex: 1 }}>{model.name}</span>
                  <div
                    className="flex-1 h-1.5 rounded-full overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${model.accuracy}%`, background: model.color }}
                    />
                  </div>
                  <span
                    style={{ fontSize: '11px', fontWeight: 600, color: model.color, width: '40px', textAlign: 'right' }}
                  >
                    {model.accuracy}%
                  </span>
                </div>
              ))}
            </div>

            {/* API connection status */}
            <div
              className="rounded-2xl p-4"
              style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <h4 style={{ fontSize: '11px', color: '#555', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '10px' }}>
                ESTADO DE CONEXIÓN
              </h4>
              <div className="space-y-2.5">
                <ConnectionRow label="API Deportiva" status="mock" note="Listo para conectar" />
                <ConnectionRow label="Backend NestJS" status="pending" note="Configura VITE_BACKEND_URL" />
                <ConnectionRow label="Supabase DB" status="pending" note="Listo para conectar" />
                <ConnectionRow label="5 IAs" status="mock" note="Mock activo" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConnectionRow({ label, status, note }: { label: string; status: 'connected' | 'mock' | 'pending'; note: string }) {
  const colors = {
    connected: '#22C55E',
    mock: '#FF6200',
    pending: '#555',
  };
  const labels = {
    connected: 'Conectado',
    mock: 'Mock',
    pending: 'Pendiente',
  };

  return (
    <div className="flex items-center justify-between">
      <span style={{ fontSize: '12px', color: '#888' }}>{label}</span>
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: colors[status] }} />
        <span style={{ fontSize: '11px', color: colors[status] }}>{labels[status]}</span>
      </div>
    </div>
  );
}