import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Calendar, Zap, Activity } from 'lucide-react';
import { AICard } from '../components/shared/AICard';
import { ConsensusPanel } from '../components/shared/ConsensusPanel';
import { PerformanceHeatmap } from '../components/shared/PerformanceHeatmap';
import { LeaderboardTable } from '../components/shared/LeaderboardTable';
import { AI_MODELS, SPORT_CONFIGS } from '../data/mockData';
import { PredictionMap } from '../services/aiService';
import { getFootballMatchday, getTodayInfo } from '../services/sportsService';
import { AnalysisStatus, Match } from '../types';

export function HomePage() {
  // Estado de análisis — el dashboard muestra el estado idle permanente
  // El análisis real ocurre en cada página de deporte/liga
  const status: AnalysisStatus = 'idle';
  const predictions: PredictionMap = {};
  const completedModels = new Set<string>();
  const [matches, setMatches] = useState<Match[]>([]);
  const today = getTodayInfo();

  useEffect(() => {
    getFootballMatchday('premier-league').then(result => setMatches(result.matches));
  }, []);

  const modelStatus = (_modelId: string): AnalysisStatus => 'idle';

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

  // KPIs
  const kpis = [
    { label: 'Picks hoy', value: matches.length * 5, sub: 'análisis totales', color: '#FF6200' },
    { label: 'Mejor IA', value: 'Gemini', sub: '71.2% precisión', color: '#4285F4' },
    { label: 'Consenso', value: status === 'complete' ? (consensusPick || 'Dividido') : '—', sub: status === 'complete' ? 'Pick del día' : 'Pendiente RUN', color: '#22C55E' },
    { label: 'Ligas activas', value: '7', sub: 'fútbol europeo', color: '#A855F7' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0A' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 md:px-8 py-4"
        style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Zap size={14} style={{ color: '#FF6200' }} />
              <span style={{ fontSize: '11px', color: '#FF6200', fontWeight: 700, letterSpacing: '0.1em' }}>
                AI SPORTS ANALYSIS ARENA
              </span>
            </div>
            <h1 className="text-white" style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1.2 }}>
              Dashboard
            </h1>
            <p style={{ fontSize: '12px', color: '#555' }}>
              <Calendar size={10} className="inline mr-1" />
              {today.formatted}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: '#22C55E' }} />
            <span style={{ fontSize: '11px', color: '#555' }}>Sistemas activos</span>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 py-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl p-4"
              style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <p style={{ fontSize: '10px', color: '#555', letterSpacing: '0.08em', marginBottom: '4px' }}>
                {kpi.label.toUpperCase()}
              </p>
              <p style={{ fontSize: '20px', fontWeight: 800, color: kpi.color, lineHeight: 1.2 }}>
                {kpi.value}
              </p>
              <p style={{ fontSize: '10px', color: '#555', marginTop: '2px' }}>{kpi.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* AI Cards Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white" style={{ fontSize: '16px', fontWeight: 700 }}>
              Motores de Análisis IA
            </h2>
            <div className="flex items-center gap-1.5">
              <Activity size={12} style={{ color: '#FF6200' }} />
              <span style={{ fontSize: '11px', color: '#FF6200' }}>5 modelos activos</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {AI_MODELS.map((model) => (
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

        {/* Consensus + Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ConsensusPanel predictions={predictions} status={status} />
          <LeaderboardTable compact />
        </div>

        {/* Heatmap */}
        <PerformanceHeatmap />

        {/* Sport Links */}
        <div>
          <h2 className="text-white mb-4" style={{ fontSize: '16px', fontWeight: 700 }}>
            Analizar por Deporte
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {SPORT_CONFIGS.map(sport => (
              <Link
                key={sport.id}
                to={sport.path}
                className="flex flex-col items-center gap-2 rounded-xl py-4 transition-all hover:scale-105"
                style={{
                  background: '#141414',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <span style={{ fontSize: '24px' }}>{sport.emoji}</span>
                <span className="text-white" style={{ fontSize: '12px', fontWeight: 600 }}>
                  {sport.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}