import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AIModel, AIPrediction, AnalysisStatus } from '../../types';

interface AICardProps {
  model: AIModel;
  status: AnalysisStatus;
  prediction?: AIPrediction;
  isHighlighted?: boolean;
}

const AI_LOGOS: Record<string, string> = {
  chatgpt: 'GPT',
  gemini: 'GEM',
  claude: 'CLD',
  qwen: 'QWN',
  perplexity: 'PRX',
};

function ProbabilityRing({ probability, color }: { probability: number; color: string }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (probability / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 72, height: 72 }}>
      <svg width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="36" cy="36" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <motion.circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>{probability}%</span>
      </div>
    </div>
  );
}

function LoadingPulse({ color }: { color: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="relative w-14 h-14">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: `2px solid ${color}` }}
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center"
          style={{ border: `2px solid rgba(255,255,255,0.1)` }}
        >
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: color }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        </div>
      </div>
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-1 h-1 rounded-full"
            style={{ background: color }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
      <span style={{ fontSize: '11px', color: '#666' }}>Analizando...</span>
    </div>
  );
}

export function AICard({ model, status, prediction, isHighlighted }: AICardProps) {
  const streakPositive = model.currentStreak > 0;
  const streakNeutral = model.currentStreak === 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: '#141414',
        border: isHighlighted
          ? `1px solid rgba(255,98,0,0.5)`
          : status === 'complete'
          ? `1px solid rgba(255,255,255,0.1)`
          : '1px solid rgba(255,255,255,0.06)',
        boxShadow: isHighlighted ? `0 0 24px rgba(255,98,0,0.15)` : undefined,
      }}
    >
      {/* Top accent bar */}
      <div className="h-0.5 w-full" style={{ background: model.color }} />

      {/* Rank badge */}
      {model.rank <= 3 && (
        <div
          className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
          style={{
            background: model.rank === 1 ? '#FFD700' : model.rank === 2 ? '#C0C0C0' : '#CD7F32',
            fontSize: '10px',
            fontWeight: 700,
            color: '#000',
          }}
        >
          {model.rank}
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${model.color}20`, border: `1px solid ${model.color}40` }}
          >
            <span style={{ fontSize: '11px', fontWeight: 800, color: model.color }}>
              {AI_LOGOS[model.id]}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-white truncate" style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.2 }}>
              {model.name}
            </p>
            <p style={{ fontSize: '11px', color: '#555', lineHeight: 1.2 }}>{model.provider}</p>
          </div>
        </div>

        {/* Stats row */}
        <div
          className="flex items-center gap-3 rounded-lg px-3 py-2 mb-3"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <div className="flex flex-col items-center flex-1">
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>
              {model.accuracy}%
            </span>
            <span style={{ fontSize: '9px', color: '#555', letterSpacing: '0.05em' }}>PRECISIÓN</span>
          </div>
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.06)' }} />
          <div className="flex flex-col items-center flex-1">
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>
              {model.totalPicks}
            </span>
            <span style={{ fontSize: '9px', color: '#555', letterSpacing: '0.05em' }}>PICKS</span>
          </div>
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.06)' }} />
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-0.5">
              {streakPositive ? (
                <TrendingUp size={10} style={{ color: '#22C55E' }} />
              ) : streakNeutral ? (
                <Minus size={10} style={{ color: '#777' }} />
              ) : (
                <TrendingDown size={10} style={{ color: '#EF4444' }} />
              )}
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: streakPositive ? '#22C55E' : streakNeutral ? '#777' : '#EF4444',
                }}
              >
                {Math.abs(model.currentStreak)}
              </span>
            </div>
            <span style={{ fontSize: '9px', color: '#555', letterSpacing: '0.05em' }}>RACHA</span>
          </div>
        </div>

        {/* Prediction area */}
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-3 gap-2"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ border: `1px dashed rgba(255,255,255,0.1)` }}
              >
                <span style={{ fontSize: '18px' }}>🎯</span>
              </div>
              <p style={{ fontSize: '11px', color: '#444', textAlign: 'center' }}>
                Presiona RUN para analizar
              </p>
            </motion.div>
          )}

          {status === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingPulse color={model.color} />
            </motion.div>
          )}

          {status === 'complete' && prediction && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-2"
            >
              <ProbabilityRing probability={prediction.probability} color={model.color} />
              <div className="text-center">
                <p className="text-white" style={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.2 }}>
                  {prediction.teamPick}
                </p>
                <p style={{ fontSize: '10px', color: '#FF6200', fontWeight: 600, letterSpacing: '0.05em' }}>
                  PICK DEL DÍA
                </p>
              </div>
              <p style={{ fontSize: '11px', color: '#888', textAlign: 'center', lineHeight: 1.5 }}>
                "{prediction.summary}"
              </p>
              {isHighlighted && (
                <div
                  className="flex items-center gap-1.5 rounded-full px-3 py-1"
                  style={{ background: 'rgba(255,98,0,0.15)', border: '1px solid rgba(255,98,0,0.3)' }}
                >
                  <CheckCircle2 size={10} style={{ color: '#FF6200' }} />
                  <span style={{ fontSize: '10px', color: '#FF6200', fontWeight: 600 }}>
                    Consenso IA
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
