import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NewBet from './pages/NewBet';
import LogRaceResult from './pages/LogRaceResult';
import History from './pages/History';
import ContenderStats from './pages/ContenderStats';
import Settings from './pages/Settings';
import SessionSummaryModal from './components/SessionSummaryModal';
import { useSessionTracking } from './hooks/useSessionTracking';

function RootComponent() {
  const { showSummary, summaryData, dismissSummary } = useSessionTracking();
  
  return (
    <Layout>
      <Outlet />
      <SessionSummaryModal 
        open={showSummary} 
        onClose={dismissSummary}
        data={summaryData}
      />
    </Layout>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const newBetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/new-bet',
  component: NewBet,
});

const logResultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/log-result',
  component: LogRaceResult,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/history',
  component: History,
});

const statsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/stats',
  component: ContenderStats,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: Settings,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  newBetRoute,
  logResultRoute,
  historyRoute,
  statsRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
