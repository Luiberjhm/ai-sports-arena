import { Clock, MapPin } from 'lucide-react';
import { Match } from '../../types';
import { PredictionMap } from '../../services/aiService';
import { AI_MODELS } from '../../data/mockData';
import { AnalysisStatus } from '../../types';

interface MatchCardProps {
  match: Match;
  predictions?: PredictionMap;
  status: AnalysisStatus;
  isConsensusPick?: boolean;
}

export function MatchCard({ match, predictions, status, isConsensusPick }: MatchCardProps) {
  // Count how many AIs picked home or away
  const homePicks = predictions
    ? Object.values(predictions).filter(p => p.teamPick === match.homeTeam.name && p.matchId === match.id).length
    : 0;
  const awayPicks = predictions
    ? Object.values(predictions).filter(p => p.teamPick === match.awayTeam.name && p.matchId === match.id).length
    : 0;

  const homePercent = homePicks + awayPicks > 0 ? (homePicks / (homePicks + awayPicks)) * 100 : 50;
  const awayPercent = 100 - homePercent;

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        background: isConsensusPick ? 'rgba(255,98,0,0.06)' : '#1C1C1C',
        border: isConsensusPick
          ? '1px solid rgba(255,98,0,0.3)'
          : '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {isConsensusPick && (
        <div
          className="flex items-center gap-2 px-4 py-1.5"
          style={{ background: 'rgba(255,98,0,0.15)', borderBottom: '1px solid rgba(255,98,0,0.2)' }}
        >
          <span style={{ fontSize: '10px' }}>🎯</span>
          <span style={{ fontSize: '10px', color: '#FF6200', fontWeight: 700, letterSpacing: '0.08em' }}>
            PARTIDO ANALIZADO POR IAs
          </span>
        </div>
      )}

      <div className="px-4 py-3">
        {/* Teams */}
        <div className="flex items-center justify-between gap-3 mb-3">
          {/* Home */}
          <div className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'white' }}>
                {match.homeTeam.abbreviation}
              </span>
            </div>
            <span className="text-white text-center" style={{ fontSize: '12px', fontWeight: 600, lineHeight: 1.3 }}>
              {match.homeTeam.name}
            </span>
            <span style={{ fontSize: '10px', color: '#555' }}>Local</span>
          </div>

          {/* VS / Score */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            {match.status === 'finished' ? (
              <div className="text-center">
                <span className="text-white" style={{ fontSize: '18px', fontWeight: 800 }}>
                  {match.homeScore} - {match.awayScore}
                </span>
                <p style={{ fontSize: '9px', color: '#22C55E', letterSpacing: '0.08em' }}>FINAL</p>
              </div>
            ) : (
              <>
                <span style={{ fontSize: '11px', color: '#444', fontWeight: 600 }}>VS</span>
                <div className="flex items-center gap-1">
                  <Clock size={9} style={{ color: '#555' }} />
                  <span style={{ fontSize: '10px', color: '#555' }}>{match.time}</span>
                </div>
              </>
            )}
          </div>

          {/* Away */}
          <div className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'white' }}>
                {match.awayTeam.abbreviation}
              </span>
            </div>
            <span className="text-white text-center" style={{ fontSize: '12px', fontWeight: 600, lineHeight: 1.3 }}>
              {match.awayTeam.name}
            </span>
            <span style={{ fontSize: '10px', color: '#555' }}>Visitante</span>
          </div>
        </div>

        {/* Venue */}
        {match.venue && (
          <div className="flex items-center gap-1.5 mb-3">
            <MapPin size={9} style={{ color: '#444' }} />
            <span style={{ fontSize: '10px', color: '#444' }}>{match.venue}</span>
          </div>
        )}

        {/* AI sentiment bar — only when predictions exist for this match */}
        {status === 'complete' && (homePicks > 0 || awayPicks > 0) && (
          <div className="mt-2">
            <div className="flex justify-between mb-1">
              <span style={{ fontSize: '10px', color: '#FF6200', fontWeight: 600 }}>
                {match.homeTeam.abbreviation} · {homePicks} IA{homePicks !== 1 ? 's' : ''}
              </span>
              <span style={{ fontSize: '10px', color: '#4285F4', fontWeight: 600 }}>
                {awayPicks} IA{awayPicks !== 1 ? 's' : ''} · {match.awayTeam.abbreviation}
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${homePercent}%`,
                  background: 'linear-gradient(90deg, #FF6200, #FF8C00)',
                  transition: 'width 0.8s ease',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
