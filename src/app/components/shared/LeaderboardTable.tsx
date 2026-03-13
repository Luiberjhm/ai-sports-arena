import { TrendingUp, TrendingDown, Minus, Crown } from 'lucide-react';
import { AIModel } from '../../types';
import { AI_MODELS } from '../../data/mockData';

interface LeaderboardTableProps {
  models?: AIModel[];
  compact?: boolean;
}

export function LeaderboardTable({ models = AI_MODELS, compact = false }: LeaderboardTableProps) {
  const sorted = [...models].sort((a, b) => b.accuracy - a.accuracy);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div>
          <h3 className="text-white" style={{ fontSize: '14px', fontWeight: 700 }}>
            Ranking IA
          </h3>
          <p style={{ fontSize: '11px', color: '#555' }}>Clasificación global por precisión</p>
        </div>
        <Crown size={16} style={{ color: '#FFD700' }} />
      </div>

      <div className="px-2 py-3">
        {/* Header */}
        {!compact && (
          <div className="flex items-center px-3 mb-2">
            <span style={{ width: '32px', fontSize: '10px', color: '#444', letterSpacing: '0.06em' }}>#</span>
            <span style={{ flex: 1, fontSize: '10px', color: '#444', letterSpacing: '0.06em' }}>MODELO</span>
            <span style={{ width: '70px', fontSize: '10px', color: '#444', letterSpacing: '0.06em', textAlign: 'right' }}>PRECISIÓN</span>
            <span style={{ width: '55px', fontSize: '10px', color: '#444', letterSpacing: '0.06em', textAlign: 'right' }}>PICKS</span>
            <span style={{ width: '55px', fontSize: '10px', color: '#444', letterSpacing: '0.06em', textAlign: 'right' }}>RACHA</span>
          </div>
        )}

        {sorted.map((model, index) => {
          const rank = index + 1;
          const rankColor = rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : rank === 3 ? '#CD7F32' : '#555';
          const streakPositive = model.currentStreak > 0;
          const streakNeutral = model.currentStreak === 0;

          return (
            <div
              key={model.id}
              className="flex items-center px-3 py-2.5 rounded-xl mb-1 transition-all hover:bg-white/[0.03]"
              style={{
                background: rank === 1 ? 'rgba(255,215,0,0.04)' : undefined,
                border: rank === 1 ? '1px solid rgba(255,215,0,0.1)' : '1px solid transparent',
              }}
            >
              {/* Rank */}
              <div style={{ width: '32px' }}>
                {rank <= 3 ? (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: rankColor }}
                  >
                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#000' }}>{rank}</span>
                  </div>
                ) : (
                  <span style={{ fontSize: '12px', color: '#444', fontWeight: 600 }}>{rank}</span>
                )}
              </div>

              {/* Model */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${model.color}20` }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: model.color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-white" style={{ fontSize: compact ? '12px' : '13px', fontWeight: 600 }}>
                    {model.name}
                  </p>
                  {!compact && (
                    <p style={{ fontSize: '10px', color: '#555' }}>{model.provider}</p>
                  )}
                </div>
              </div>

              {/* Accuracy */}
              <div style={{ width: compact ? '55px' : '70px', textAlign: 'right' }}>
                <span
                  style={{
                    fontSize: compact ? '13px' : '15px',
                    fontWeight: 700,
                    color: rank === 1 ? '#FFD700' : 'white',
                  }}
                >
                  {model.accuracy}%
                </span>
              </div>

              {!compact && (
                <>
                  {/* Picks */}
                  <div style={{ width: '55px', textAlign: 'right' }}>
                    <span style={{ fontSize: '12px', color: '#888' }}>{model.totalPicks}</span>
                  </div>

                  {/* Streak */}
                  <div style={{ width: '55px', textAlign: 'right' }}>
                    <div className="flex items-center justify-end gap-1">
                      {streakPositive ? (
                        <TrendingUp size={11} style={{ color: '#22C55E' }} />
                      ) : streakNeutral ? (
                        <Minus size={11} style={{ color: '#777' }} />
                      ) : (
                        <TrendingDown size={11} style={{ color: '#EF4444' }} />
                      )}
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: streakPositive ? '#22C55E' : streakNeutral ? '#777' : '#EF4444',
                        }}
                      >
                        {Math.abs(model.currentStreak)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
