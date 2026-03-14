import { NavLink, useLocation } from 'react-router';
import {
  Home, Trophy, BarChart3, ChevronRight,
  Zap, Activity
} from 'lucide-react';
import { SPORT_CONFIGS } from '../../data/mockData';

const NAV_TOP = [
  { path: '/', label: 'Inicio', icon: Home },
];

const NAV_BOTTOM = [
  { path: '/leaderboard', label: 'Leaderboard IA', icon: Trophy },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside
      className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0"
      style={{ background: '#0D0D0D', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: '#FF6200' }}
        >
          <Zap size={16} className="text-white" />
        </div>
        <div>
          <p className="text-white" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', lineHeight: 1.2 }}>
            AI SPORTS
          </p>
          <p style={{ fontSize: '10px', color: '#FF6200', fontWeight: 600, letterSpacing: '0.08em' }}>
            ANALYSIS ARENA
          </p>
        </div>
      </div>

      {/* Nav principal */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-5">
          {NAV_TOP.map(item => (
            <SidebarLink key={item.path} {...item} />
          ))}
        </div>

        {/* Deportes */}
        <div>
          <p style={{ fontSize: '10px', color: '#555', fontWeight: 700, letterSpacing: '0.1em', paddingLeft: '10px', marginBottom: '6px', textTransform: 'uppercase' }}>
            Deportes
          </p>
          {SPORT_CONFIGS.map(sport => (
            <NavLink
              key={sport.id}
              to={sport.path}
              className={() => {
                const isActive = location.pathname === sport.path;
                return `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all group ${isActive ? '' : 'hover:bg-white/[0.04]'}`;
              }}
              style={({ isActive }) => ({
                background: isActive ? 'rgba(255, 98, 0, 0.12)' : undefined,
                border: isActive ? '1px solid rgba(255,98,0,0.25)' : '1px solid transparent',
              })}
            >
              {({ isActive }) => (
                <>
                  <span style={{ fontSize: '16px' }}>{sport.emoji}</span>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#FF6200' : '#A0A0A0',
                    }}
                  >
                    {sport.name}
                  </span>
                  {isActive && (
                    <ChevronRight size={12} className="ml-auto" style={{ color: '#FF6200' }} />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Nav inferior */}
        <div className="mt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
          {NAV_BOTTOM.map(item => (
            <SidebarLink key={item.path} {...item} />
          ))}
        </div>
      </nav>

      {/* Status bar */}
      <div
        className="px-4 py-3 m-3 rounded-xl"
        style={{ background: 'rgba(255,98,0,0.08)', border: '1px solid rgba(255,98,0,0.2)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Activity size={12} style={{ color: '#FF6200' }} />
          <span style={{ fontSize: '10px', color: '#FF6200', fontWeight: 700, letterSpacing: '0.08em' }}>
            ESTADO DEL SISTEMA
          </span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#22C55E' }} />
          <span style={{ fontSize: '11px', color: '#777' }}>APIs deportivas: <span style={{ color: '#22C55E' }}>ESPN activo</span></span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#22C55E' }} />
          <span style={{ fontSize: '11px', color: '#777' }}>5 IAs: <span style={{ color: '#22C55E' }}>Listas</span></span>
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({ path, label, icon: Icon }: { path: string; label: string; icon: any }) {
  return (
    <NavLink
      to={path}
      className={() => 'flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all group'}
      style={({ isActive }) => ({
        background: isActive ? 'rgba(255, 98, 0, 0.12)' : undefined,
        border: isActive ? '1px solid rgba(255,98,0,0.25)' : '1px solid transparent',
      })}
      end={path === '/'}
    >
      {({ isActive }) => (
        <>
          <Icon size={15} style={{ color: isActive ? '#FF6200' : '#666', transition: 'color 0.2s' }} />
          <span
            style={{
              fontSize: '13px',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#FF6200' : '#A0A0A0',
            }}
          >
            {label}
          </span>
          {isActive && <ChevronRight size={12} className="ml-auto" style={{ color: '#FF6200' }} />}
        </>
      )}
    </NavLink>
  );
}
