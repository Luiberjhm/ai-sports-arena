import { motion, AnimatePresence } from 'motion/react';
import { Zap, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { AnalysisStatus } from '../../types';

interface RunButtonProps {
  status: AnalysisStatus;
  matchCount: number;
  onRun: () => void;
  label?: string;
}

export function RunButton({ status, matchCount, onRun, label }: RunButtonProps) {
  const isDisabled = status === 'loading' || matchCount === 0;

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        onClick={onRun}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.03 } : undefined}
        whileTap={!isDisabled ? { scale: 0.97 } : undefined}
        className="relative flex items-center gap-3 rounded-xl overflow-hidden"
        style={{
          background: status === 'complete'
            ? 'linear-gradient(135deg, #16A34A, #15803D)'
            : status === 'loading'
            ? 'linear-gradient(135deg, #CC4E00, #FF6200)'
            : 'linear-gradient(135deg, #FF6200, #FF8C00)',
          padding: '14px 32px',
          border: 'none',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          boxShadow: status === 'complete'
            ? '0 0 24px rgba(22,163,74,0.3)'
            : '0 0 24px rgba(255,98,0,0.35)',
          opacity: isDisabled && status !== 'loading' ? 0.6 : 1,
          minWidth: '200px',
          justifyContent: 'center',
        }}
      >
        {/* Shimmer effect */}
        {status === 'idle' && (
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
              x: '-100%',
            }}
            animate={{ x: '200%' }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
        )}

        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5"
            >
              <Zap size={18} className="text-white" />
              <span className="text-white" style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '0.05em' }}>
                {label || '⚡ ANALIZAR JORNADA'}
              </span>
            </motion.div>
          )}

          {status === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 size={18} className="text-white" />
              </motion.div>
              <span className="text-white" style={{ fontSize: '15px', fontWeight: 700 }}>
                Analizando...
              </span>
            </motion.div>
          )}

          {status === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5"
            >
              <CheckCircle2 size={18} className="text-white" />
              <span className="text-white" style={{ fontSize: '15px', fontWeight: 700 }}>
                Análisis Completo
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Subtitle */}
      <AnimatePresence>
        {matchCount > 0 && status === 'idle' && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ fontSize: '11px', color: '#555' }}
          >
            {matchCount} partido{matchCount !== 1 ? 's' : ''} • 5 IAs analizarán simultáneamente
          </motion.p>
        )}
        {status === 'loading' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ fontSize: '11px', color: '#FF6200' }}
          >
            Consultando 5 modelos de IA en paralelo...
          </motion.p>
        )}
        {status === 'complete' && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onRun}
            style={{ fontSize: '11px', color: '#555', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Re-analizar
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
