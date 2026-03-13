import { motion, AnimatePresence } from 'motion/react';
import { Users, Target, AlertTriangle } from 'lucide-react';
import { PredictionMap } from '../../services/aiService';
import { calculateConsensus } from '../../services/aiService';
import { AI_MODELS } from '../../data/mockData';
import { AnalysisStatus } from '../../types';

interface ConsensusPanelProps {
  predictions: PredictionMap;
  status: AnalysisStatus;
}

export function ConsensusPanel({ predictions, status }: ConsensusPanelProps) {
  const consensus = status === 'complete' ? calculateConsensus(predictions) : null;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: '#141414',
        border: consensus?.hasConsensus
          ? '1px solid rgba(255,98,0,0.4)'
          : '1px solid rgba(255,255,255,0.06)',
        boxShadow: consensus?.hasConsensus ? '0 0 32px rgba(255,98,0,0.1)' : undefined,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-5 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(255,98,0,0.15)' }}
        >
          <Users size={14} style={{ color: '#FF6200' }} />
        </div>
        <div>
          <h3 className="text-white" style={{ fontSize: '14px', fontWeight: 700 }}>
            Consenso IA
          </h3>
          <p style={{ fontSize: '11px', color: '#555' }}>Cuando 3+ modelos coinciden</p>
        </div>
      </div>

      <div className="p-5">
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-6 gap-3"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ border: '1px dashed rgba(255,255,255,0.1)' }}
              >
                <Target size={20} style={{ color: '#333' }} />
              </div>
              <p style={{ fontSize: '13px', color: '#444', textAlign: 'center' }}>
                El consenso aparecerá cuando<br />las IAs terminen de analizar
              </p>
            </motion.div>
          )}

          {status === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-6 gap-3"
            >
              <div className="flex gap-2">
                {AI_MODELS.map((model, i) => (
                  <motion.div
                    key={model.id}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${model.color}15`, border: `1px solid ${model.color}30` }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ background: model.color }} />
                  </motion.div>
                ))}
              </div>
              <p style={{ fontSize: '12px', color: '#555' }}>Consolidando predicciones...</p>
            </motion.div>
          )}

          {status === 'complete' && consensus && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {consensus.hasConsensus ? (
                <>
                  {/* Big consensus display */}
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="flex-1 rounded-xl p-4"
                      style={{ background: 'rgba(255,98,0,0.1)', border: '1px solid rgba(255,98,0,0.25)' }}
                    >
                      <p style={{ fontSize: '11px', color: '#FF6200', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '4px' }}>
                        🎯 PICK CONSENSO
                      </p>
                      <p className="text-white" style={{ fontSize: '22px', fontWeight: 800, lineHeight: 1.2 }}>
                        {consensus.teamPick}
                      </p>
                      <p style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                        {consensus.count}/5 IAs acuerdan • {consensus.avgProbability}% prob. media
                      </p>
                    </div>
                  </div>

                  {/* Model agreement indicators */}
                  <div>
                    <p style={{ fontSize: '10px', color: '#555', letterSpacing: '0.08em', marginBottom: '8px' }}>
                      MODELOS QUE CONCUERDAN
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {AI_MODELS.map(model => {
                        const agrees = consensus.models.includes(model.id);
                        return (
                          <div
                            key={model.id}
                            className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
                            style={{
                              background: agrees ? `${model.color}15` : 'rgba(255,255,255,0.04)',
                              border: `1px solid ${agrees ? model.color + '40' : 'rgba(255,255,255,0.06)'}`,
                            }}
                          >
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ background: agrees ? model.color : '#333' }}
                            />
                            <span
                              style={{
                                fontSize: '11px',
                                color: agrees ? model.color : '#444',
                                fontWeight: agrees ? 600 : 400,
                              }}
                            >
                              {model.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center py-4 gap-3">
                  <AlertTriangle size={24} style={{ color: '#F59E0B' }} />
                  <div className="text-center">
                    <p className="text-white" style={{ fontSize: '14px', fontWeight: 600 }}>
                      Sin consenso claro
                    </p>
                    <p style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>
                      Las IAs tienen opiniones divididas esta jornada
                    </p>
                  </div>
                  <div className="w-full rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <p style={{ fontSize: '11px', color: '#666', marginBottom: '6px' }}>Picks individuales:</p>
                    {Object.entries(predictions).map(([modelId, pred]) => {
                      const model = AI_MODELS.find(m => m.id === modelId);
                      return (
                        <div key={modelId} className="flex justify-between items-center py-1">
                          <span style={{ fontSize: '12px', color: model?.color || '#888' }}>
                            {model?.name}
                          </span>
                          <span style={{ fontSize: '12px', color: 'white', fontWeight: 600 }}>
                            {pred.teamPick} ({pred.probability}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
