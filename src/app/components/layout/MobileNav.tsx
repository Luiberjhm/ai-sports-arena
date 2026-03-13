import { NavLink } from 'react-router';
import { Home, Trophy, BarChart3 } from 'lucide-react';
import { SPORT_CONFIGS } from '../../data/mockData';

const ALL_NAV = [
  { path: '/', label: 'Inicio', emoji: '🏠', isEnd: true },
  ...SPORT_CONFIGS.map(s => ({ path: s.path, label: s.name, emoji: s.emoji, isEnd: false })),
  { path: '/leaderboard', label: 'Ranking', emoji: '🏆', isEnd: false },
  { path: '/analytics', label: 'Stats', emoji: '📊', isEnd: false },
];

export function MobileNav() {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: '#0D0D0D',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex overflow-x-auto scrollbar-none" style={{ WebkitOverflowScrolling: 'touch' }}>
        {ALL_NAV.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.isEnd}
            className="flex flex-col items-center justify-center gap-0.5 shrink-0 transition-all"
            style={({ isActive }) => ({
              minWidth: '64px',
              padding: '10px 4px 12px',
              borderTop: isActive ? '2px solid #FF6200' : '2px solid transparent',
              background: isActive ? 'rgba(255,98,0,0.08)' : 'transparent',
            })}
          >
            {({ isActive }) => (
              <>
                <span style={{ fontSize: '18px', lineHeight: 1 }}>{item.emoji}</span>
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: isActive ? 700 : 400,
                    color: isActive ? '#FF6200' : '#666',
                    letterSpacing: '0.02em',
                    marginTop: '2px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
