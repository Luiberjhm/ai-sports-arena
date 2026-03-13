import { AIModel } from '../../types';
import { AI_MODELS } from '../../data/mockData';

interface PerformanceHeatmapProps {
  models?: AIModel[];
  compact?: boolean;
}

const DAY_LABELS = ['D-9', 'D-8', 'D-7', 'D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'D-1', 'Hoy'];

export function PerformanceHeatmap({ models = AI_MODELS, compact = false }: PerformanceHeatmapProps) {
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
            Rendimiento Histórico
          </h3>
          <p style={{ fontSize: '11px', color: '#555' }}>Últimos 10 días · por modelo</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#22C55E' }} />
            <span style={{ fontSize: '10px', color: '#666' }}>Acierto</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#EF4444' }} />
            <span style={{ fontSize: '10px', color: '#666' }}>Fallo</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 overflow-x-auto">
        {/* Day labels */}
        <div className="flex items-center gap-1 mb-3" style={{ paddingLeft: compact ? '80px' : '100px' }}>
          {DAY_LABELS.map(day => (
            <div
              key={day}
              className="flex items-center justify-center"
              style={{ width: compact ? '26px' : '30px', shrink: 0 }}
            >
              <span style={{ fontSize: '9px', color: '#444', whiteSpace: 'nowrap' }}>{day}</span>
            </div>
          ))}
        </div>

        {/* Model rows */}
        {models.map(model => (
          <div key={model.id} className="flex items-center gap-1 mb-2">
            {/* Model name */}
            <div
              className="flex items-center gap-2 shrink-0"
              style={{ width: compact ? '80px' : '100px' }}
            >
              <div
                className="w-1.5 h-5 rounded-full shrink-0"
                style={{ background: model.color }}
              />
              <span
                style={{
                  fontSize: compact ? '10px' : '11px',
                  color: '#A0A0A0',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {model.name}
              </span>
            </div>

            {/* Heatmap cells */}
            <div className="flex gap-1">
              {model.heatmap.map((result, index) => (
                <div
                  key={index}
                  className="rounded-sm flex items-center justify-center"
                  title={
                    result === null
                      ? 'Sin predicción'
                      : result
                      ? '✅ Correcto'
                      : '❌ Incorrecto'
                  }
                  style={{
                    width: compact ? '26px' : '30px',
                    height: compact ? '26px' : '30px',
                    background:
                      result === null
                        ? 'rgba(255,255,255,0.04)'
                        : result
                        ? 'rgba(34,197,94,0.25)'
                        : 'rgba(239,68,68,0.25)',
                    border:
                      result === null
                        ? '1px solid rgba(255,255,255,0.04)'
                        : result
                        ? '1px solid rgba(34,197,94,0.4)'
                        : '1px solid rgba(239,68,68,0.4)',
                    shrink: 0,
                  }}
                >
                  {result !== null && (
                    <span style={{ fontSize: '11px' }}>
                      {result ? '✓' : '✗'}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Accuracy at end */}
            <div
              className="ml-2 shrink-0 rounded-md px-2 py-0.5"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <span style={{ fontSize: '11px', fontWeight: 700, color: model.color }}>
                {model.accuracy}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
