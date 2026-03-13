import { createBrowserRouter } from 'react-router';
import { createElement } from 'react';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { FootballPage } from './pages/FootballPage';
import { SportsPage } from './pages/SportsPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { AnalyticsPage } from './pages/AnalyticsPage';

const NBAPage = () => createElement(SportsPage, { sport: 'nba' });
const NFLPage = () => createElement(SportsPage, { sport: 'nfl' });
const MLBPage = () => createElement(SportsPage, { sport: 'mlb' });
const NHLPage = () => createElement(SportsPage, { sport: 'nhl' });
const NCAAPage = () => createElement(SportsPage, { sport: 'ncaa' });

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'futbol', Component: FootballPage },
      { path: 'nba', Component: NBAPage },
      { path: 'nfl', Component: NFLPage },
      { path: 'mlb', Component: MLBPage },
      { path: 'nhl', Component: NHLPage },
      { path: 'ncaa', Component: NCAAPage },
      { path: 'leaderboard', Component: LeaderboardPage },
      { path: 'analytics', Component: AnalyticsPage },
    ],
  },
]);
