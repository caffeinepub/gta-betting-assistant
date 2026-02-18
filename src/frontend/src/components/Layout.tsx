import { Link, useLocation } from '@tanstack/react-router';
import { TrendingUp, Plus, FileText, History, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: TrendingUp },
    { path: '/new-bet', label: 'New Bet', icon: Plus },
    { path: '/log-result', label: 'Log Result', icon: FileText },
    { path: '/history', label: 'History', icon: History },
    { path: '/stats', label: 'Stats', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">GTA Betting Assistant</h1>
                <p className="text-xs text-muted-foreground">Adaptive Prediction Engine</p>
              </div>
            </div>
          </div>
          <nav className="mt-4 flex gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="border-t border-border/40 bg-card/30 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} · Built with love using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'gta-betting-assistant'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
