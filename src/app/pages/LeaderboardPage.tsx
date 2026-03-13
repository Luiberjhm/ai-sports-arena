import { motion } from 'motion/react';
import { Crown, TrendingUp, TrendingDown, Minus, Target } from 'lucide-react';
import { AI_MODELS, SPORT_CONFIGS } from '../data/mockData';

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
        {/* New Cylindrical Podium */}
        <div className="flex items-end justify-center gap-4 md:gap-8 pb-8 pt-4 min-h-[340px]">
          {[sorted[1], sorted[0], sorted[2]].map((model, index) => {
            // Index 0 es el 2do lugar (izquierda)
            // Index 1 es el 1er lugar (centro)
            // Index 2 es el 3er lugar (derecha)
            const isFirst = index === 1;
            const isSecond = index === 0;
            const isThird = index === 2;
            
            const rank = isFirst ? 1 : isSecond ? 2 : 3;
            const color = isFirst ? '#FFD700' : isSecond ? '#C0C0C0' : '#CD7F32';
            const height = isFirst ? 'h-64' : isSecond ? 'h-48' : 'h-36';
            
            // Efecto cilindro con gradientes
            const cylinderGradient = `linear-gradient(180deg, ${color}20 0%, ${color}05 100%)`;
            const topGradient = `linear-gradient(180deg, ${color}40 0%, ${color}10 100%)`;

            return (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 + 0.2, type: 'spring', stiffness: 100 }}
                className="flex flex-col items-center w-24 md:w-32"
              >
                {/* Avatar & Info floating above */}
                <div className="flex flex-col items-center mb-3 space-y-1">
                  {isFirst && <Crown size={24} color="#FFD700" className="mb-1 drop-shadow-lg" />}
                  
                  <div
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg relative z-10"
                    style={{ 
                      background: '#141414', 
                      border: `2px solid ${model.color}`,
                      boxShadow: `0 0 15px ${model.color}30`
                    }}
                  >
                    <div className="w-4 h-4 rounded-full" style={{ background: model.color }} />
                  </div>
                  
                  <div className="text-center">
                    <p className="text-white text-sm font-bold truncate w-full">
                    {model.name}
                  </p>
                  <p
                      style={{ color, fontWeight: 800, fontSize: '16px' }}
                    >
                    {model.accuracy}%
                  </p>
                  </div>
                </div>

                {/* Cylinder Bar */}
                <div
                  className={`w-full ${height} rounded-t-2xl relative flex items-end justify-center pb-4 backdrop-blur-sm transition-all hover:brightness-125`}
                  style={{ 
                    background: cylinderGradient,
                    border: `1px solid ${color}30`,
                    borderBottom: 'none',
                    boxShadow: isFirst ? `0 0 40px ${color}10` : 'none'
                  }}
                >
                  {/* Top "lid" highlight for 3D effect */}
                  <div className="absolute top-0 inset-x-0 h-4 bg-white/5 rounded-t-2xl" />
                  
                  <span style={{ fontSize: '40px', fontWeight: 900, color: color, opacity: 0.3 }}>
                    {rank}
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
