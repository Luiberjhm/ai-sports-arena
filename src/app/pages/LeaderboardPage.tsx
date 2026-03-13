import { motion } from 'motion/react';
import { Crown, TrendingUp, TrendingDown, Minus, Target } from 'lucide-react';
import { AI_MODELS, SPORT_CONFIGS } from '../data/mockData';
import { PerformanceHeatmap } from '../components/shared/PerformanceHeatmap';

export function LeaderboardPage() {
  const sorted = [...AI_MODELS].sort((a, b) => b.accuracy - a.accuracy);

  const rankColor = (rank: number) =>
    rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : rank === 3 ? '#CD7F32' : '#555';

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0A' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 md:px-8 py-4"
        style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-3">
          <Crown size={22} style={{ color: '#FFD700' }} />
          <div>
            <h1 className="text-white" style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1.2 }}>
              Leaderboard IA
            </h1>
            <p style={{ fontSize: '12px', color: '#555' }}>Ranking global de precisión · Todos los deportes</p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 py-6 space-y-6">
        {/* Podium */}
        <div className="grid grid-cols-3 gap-4">
          {[sorted[1], sorted[0], sorted[2]].map((model, podiumIndex) => {
            const actualRank = podiumIndex === 0 ? 2 : podiumIndex === 1 ? 1 : 3;
            const heights = ['h-28', 'h-36', 'h-24'];
            const podiumColors = ['#C0C0C0', '#FFD700', '#CD7F32'];

            return (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: podiumIndex * 0.1 + 0.2 }}
                className="flex flex-col items-center"
              >
                {/* Card */}
                <div
                  className="w-full rounded-2xl p-4 text-center mb-2"
                  style={{
                    background: '#141414',
                    border: `1px solid ${podiumColors[podiumIndex]}30`,
                    boxShadow: podiumIndex === 1 ? `0 0 32px ${podiumColors[1]}15` : undefined,
                  }}
                >
                  {actualRank === 1 && <span style={{ fontSize: '20px' }}>👑</span>}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2"
                    style={{ background: `${model.color}20`, border: `1px solid ${model.color}40` }}
                  >
                    <div className="w-4 h-4 rounded-full" style={{ background: model.color }} />
                  </div>
                  <p className="text-white" style={{ fontSize: '13px', fontWeight: 700 }}>
                    {model.name}
                  </p>
                  <p style={{ fontSize: '11px', color: '#555' }}>{model.provider}</p>
                  <p
                    style={{
                      fontSize: '22px',
                      fontWeight: 800,
                      color: podiumColors[podiumIndex],
                      marginTop: '6px',
                    }}
                  >
                    {model.accuracy}%
                  </p>
                </div>
                {/* Podium base */}
                <div
                  className={`w-full rounded-t-xl flex items-center justify-center ${heights[podiumIndex]}`}
                  style={{ background: `${podiumColors[podiumIndex]}20`, border: `1px solid ${podiumColors[podiumIndex]}25` }}
                >
                  <span style={{ fontSize: '28px', fontWeight: 900, color: podiumColors[podiumIndex], opacity: 0.5 }}>
                    {actualRank}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Full ranking table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div
            className="px-6 py-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <h2 className="text-white" style={{ fontSize: '16px', fontWeight: 700 }}>
              Clasificación Completa
            </h2>
          </div>

          {/* Table header */}
          <div
            className="grid px-6 py-3"
            style={{
              gridTemplateColumns: '40px 1fr 80px 70px 70px 80px',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            {['#', 'MODELO', 'PRECISIÓN', 'PICKS', 'ACIERTOS', 'RACHA'].map(h => (
              <span key={h} style={{ fontSize: '10px', color: '#444', fontWeight: 700, letterSpacing: '0.08em' }}>
                {h}
              </span>
            ))}
          </div>

          {sorted.map((model, index) => {
            const rank = index + 1;
            const streakPositive = model.currentStreak > 0;
            const streakNeutral = model.currentStreak === 0;

            return (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="grid px-6 py-4 hover:bg-white/[0.02] transition-all"
                style={{
                  gridTemplateColumns: '40px 1fr 80px 70px 70px 80px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  background: rank === 1 ? 'rgba(255,215,0,0.03)' : undefined,
                }}
              >
                {/* Rank */}
                <div className="flex items-center">
                  {rank <= 3 ? (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: rankColor(rank) }}
                    >
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#000' }}>{rank}</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: '14px', color: '#444', fontWeight: 600 }}>{rank}</span>
                  )}
                </div>

                {/* Model */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${model.color}20`, border: `1px solid ${model.color}30` }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: model.color }} />
                  </div>
                  <div>
                    <p className="text-white" style={{ fontSize: '14px', fontWeight: 600 }}>
                      {model.name}
                    </p>
                    <p style={{ fontSize: '11px', color: '#555' }}>{model.provider}</p>
                  </div>
                </div>

                {/* Accuracy */}
                <div className="flex items-center">
                  <div>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: rank === 1 ? '#FFD700' : 'white' }}>
                      {model.accuracy}%
                    </p>
                    <div className="h-1 w-16 rounded-full overflow-hidden mt-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${model.accuracy}%`, background: model.color }}
                      />
                    </div>
                  </div>
                </div>

                {/* Total picks */}
                <div className="flex items-center">
                  <span style={{ fontSize: '14px', color: '#888' }}>{model.totalPicks}</span>
                </div>

                {/* Correct picks */}
                <div className="flex items-center">
                  <span style={{ fontSize: '14px', color: '#22C55E' }}>{model.correctPicks}</span>
                </div>

                {/* Streak */}
                <div className="flex items-center gap-1.5">
                  {streakPositive ? (
                    <TrendingUp size={14} style={{ color: '#22C55E' }} />
                  ) : streakNeutral ? (
                    <Minus size={14} style={{ color: '#777' }} />
                  ) : (
                    <TrendingDown size={14} style={{ color: '#EF4444' }} />
                  )}
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: streakPositive ? '#22C55E' : streakNeutral ? '#777' : '#EF4444',
                    }}
                  >
                    {Math.abs(model.currentStreak)}
                  </span>
                  <span style={{ fontSize: '11px', color: '#444' }}>
                    {streakPositive ? 'aciertos' : streakNeutral ? '' : 'fallos'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Heatmap */}
        <PerformanceHeatmap />

        {/* Sport-by-sport mini table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-white" style={{ fontSize: '16px', fontWeight: 700 }}>
              Mejor IA por Deporte
            </h2>
          </div>
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            {SPORT_CONFIGS.map(sport => {
              const bestModel = sorted[0];
              return (
                <div
                  key={sport.id}
                  className="rounded-xl p-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ fontSize: '16px' }}>{sport.emoji}</span>
                    <span style={{ fontSize: '12px', color: '#888' }}>{sport.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: bestModel.color }} />
                    <span className="text-white" style={{ fontSize: '13px', fontWeight: 600 }}>
                      {bestModel.name}
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>
                    {bestModel.accuracy}% precisión
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
