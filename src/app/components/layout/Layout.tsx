import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

export function Layout() {
  return (
    <div className="flex min-h-screen" style={{ background: '#0A0A0A' }}>
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-x-hidden pb-24 md:pb-0">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
