import { useState } from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Target, Zap } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from 'recharts';
import { AI_MODELS, ANALYTICS_DATA, SPORT_ACCURACY_DATA } from '../data/mockData';
import { PerformanceHeatmap } from '../components/shared/PerformanceHeatmap';

const MODEL_COLORS: Record<string, string> = {
  ChatGPT: '#74AA9C',
  Gemini: '#4285F4',
  Claude: '#D4956A',
  Qwen: '#A855F7',
  Perplexity: '#1FB8C3',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl p-3 shadow-xl"
        style={{ background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <p style={{ fontSize: '11px', color: '#FF6200', fontWeight: 700, marginBottom: '6px' }}>
          {label}
        </p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 py-0.5">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span style={{ fontSize: '11px', color: '#888' }}>{entry.name}:</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'white' }}>
              {entry.value}%
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function AnalyticsPage() {
  const [activeModels, setActiveModels] = useState<Set<string>>(
    new Set(['ChatGPT', 'Gemini', 'Claude', 'Qwen', 'Perplexity'])
  );

  const toggleModel = (name: string) => {
    setActiveModels(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        if (next.size > 1) next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const totalPredictions = AI_MODELS.reduce((sum, m) => sum + m.totalPicks, 0);
  const avgAccuracy = (AI_MODELS.reduce((sum, m) => sum + m.accuracy, 0) / AI_MODELS.length).toFixed(1);
  const bestModel = [...AI_MODELS].sort((a, b) => b.accuracy - a.accuracy)[0];

  const radarData = [
    { subject: 'Fútbol', ChatGPT: 70, Gemini: 73, Claude: 68, Qwen: 65, Perplexity: 71 },
    { subject: 'NBA', ChatGPT: 67, Gemini: 70, Claude: 65, Qwen: 62, Perplexity: 69 },
    { subject: 'NFL', ChatGPT: 65, Gemini: 68, Claude: 64, Qwen: 60, Perplexity: 67 },
    { subject: 'MLB', ChatGPT: 64, Gemini: 67, Claude: 63, Qwen: 59, Perplexity: 66 },
    { subject: 'NHL', ChatGPT: 66, Gemini: 69, Claude: 65, Qwen: 61, Perplexity: 68 },
    { subject: 'NCAA', ChatGPT: 63, Gemini: 66, Claude: 62, Qwen: 58, Perplexity: 65 },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0A' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 md:px-8 py-4"
        style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-3">
          <BarChart3 size={22} style={{ color: '#FF6200' }} />
          <div>
            <h1 className="text-white" style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1.2 }}>
              Analytics
            </h1>
            <p style={{ fontSize: '12px', color: '#555' }}>Rendimiento histórico · Comparativa de modelos</p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 py-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total predicciones', value: totalPredictions.toLocaleString(), icon: Target, color: '#FF6200' },
            { label: 'Precisión media', value: `${avgAccuracy}%`, icon: TrendingUp, color: '#22C55E' },
            { label: 'Mejor modelo', value: bestModel.name, icon: Zap, color: '#FFD700' },
            { label: 'Deportes cubiertos', value: '6', icon: BarChart3, color: '#4285F4' },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl p-4"
              style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <kpi.icon size={13} style={{ color: kpi.color }} />
                <span style={{ fontSize: '10px', color: '#555', letterSpacing: '0.06em' }}>
                  {kpi.label.toUpperCase()}
                </span>
              </div>
              <p style={{ fontSize: '22px', fontWeight: 800, color: kpi.color }}>
                {kpi.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Model toggle */}
        <div className="flex flex-wrap gap-2">
          {AI_MODELS.map(model => (
            <button
              key={model.id}
              onClick={() => toggleModel(model.name)}
              className="flex items-center gap-2 rounded-full px-3 py-1.5 transition-all"
              style={{
                background: activeModels.has(model.name) ? `${model.color}20` : 'rgba(255,255,255,0.04)',
                border: activeModels.has(model.name) ? `1px solid ${model.color}50` : '1px solid rgba(255,255,255,0.06)',
                cursor: 'pointer',
                opacity: activeModels.has(model.name) ? 1 : 0.5,
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: model.color }} />
              <span style={{ fontSize: '12px', color: activeModels.has(model.name) ? model.color : '#666', fontWeight: 500 }}>
                {model.name}
              </span>
            </button>
          ))}
        </div>

        {/* Line chart — accuracy over time */}
        <div
          className="rounded-2xl p-5"
          style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="mb-4">
            <h2 className="text-white" style={{ fontSize: '15px', fontWeight: 700 }}>
              Evolución de Precisión
            </h2>
            <p style={{ fontSize: '11px', color: '#555' }}>Últimos 10 días · porcentaje de acierto</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={ANALYTICS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="dia"
                tick={{ fill: '#555', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                tickLine={false}
              />
              <YAxis
                domain={[50, 80]}
                tick={{ fill: '#555', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                tickLine={false}
                tickFormatter={v => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              {Object.entries(MODEL_COLORS).map(([name, color]) =>
                activeModels.has(name) ? (
                  <Line
                    key={name}
                    type="monotone"
                    dataKey={name}
                    stroke={color}
                    strokeWidth={2}
                    dot={{ r: 3, fill: color, strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                ) : null
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart — accuracy by sport */}
        <div
          className="rounded-2xl p-5"
          style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="mb-4">
            <h2 className="text-white" style={{ fontSize: '15px', fontWeight: 700 }}>
              Precisión por Deporte
            </h2>
            <p style={{ fontSize: '11px', color: '#555' }}>Comparativa de todos los modelos por categoría</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={SPORT_ACCURACY_DATA} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="deporte"
                tick={{ fill: '#555', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                tickLine={false}
              />
              <YAxis
                domain={[50, 80]}
                tick={{ fill: '#555', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                tickLine={false}
                tickFormatter={v => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              {Object.entries(MODEL_COLORS).map(([name, color]) =>
                activeModels.has(name) ? (
                  <Bar key={name} dataKey={name} fill={color} radius={[3, 3, 0, 0]} maxBarSize={20} />
                ) : null
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar chart */}
        <div
          className="rounded-2xl p-5"
          style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="mb-4">
            <h2 className="text-white" style={{ fontSize: '15px', fontWeight: 700 }}>
              Mapa de Cobertura
            </h2>
            <p style={{ fontSize: '11px', color: '#555' }}>Rendimiento relativo por deporte</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 11 }} />
              {Object.entries(MODEL_COLORS).map(([name, color]) =>
                activeModels.has(name) ? (
                  <Radar
                    key={name}
                    name={name}
                    dataKey={name}
                    stroke={color}
                    fill={color}
                    fillOpacity={0.08}
                    strokeWidth={1.5}
                  />
                ) : null
              )}
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Heatmap */}
        <PerformanceHeatmap />
      </div>
    </div>
  );
}
