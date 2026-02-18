import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Plus, FileText, History, RotateCcw, Settings, TrendingUp, TrendingDown } from 'lucide-react';
import StatCard from '@/components/StatCard';
import ModelHealthIndicator from '@/components/ModelHealthIndicator';
import StrategyModeDisplay from '@/components/StrategyModeDisplay';
import LastPredictionSummary from '@/components/LastPredictionSummary';
import ContextualWarning from '@/components/ContextualWarning';
import { useGetRaceHistory, useGetModelStats } from '@/hooks/useQueries';
import { calculateDashboardStats } from '@/lib/betting-calculations';

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: raceHistory = [], isLoading: historyLoading } = useGetRaceHistory();
  const { data: modelStats, isLoading: statsLoading } = useGetModelStats();

  const stats = calculateDashboardStats(raceHistory);
  const isLoading = historyLoading || statsLoading;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Your betting performance at a glance</p>
      </div>

      {modelStats?.confidenceLevel === 'Low' && (
        <ContextualWarning type="lowConfidence" />
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Races"
          value={stats.totalRaces}
          subtitle="Logged"
        />
        <StatCard
          title="Total Bets"
          value={stats.totalBets}
          subtitle="Placed"
        />
        <StatCard
          title="Profit/Loss"
          value={`$${stats.totalProfit.toLocaleString()}`}
          subtitle={stats.totalProfit >= 0 ? 'Profit' : 'Loss'}
          trend={stats.totalProfit >= 0 ? 'up' : 'down'}
        />
        <StatCard
          title="ROI"
          value={`${stats.roi.toFixed(1)}%`}
          subtitle="Return on Investment"
          trend={stats.roi >= 0 ? 'up' : 'down'}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Prediction Accuracy"
          value={`${stats.accuracy.toFixed(1)}%`}
          subtitle="Overall"
        />
        <StatCard
          title="Session P/L"
          value={`$${stats.sessionProfit.toLocaleString()}`}
          subtitle="Current Session"
          trend={stats.sessionProfit >= 0 ? 'up' : 'down'}
        />
        <StatCard
          title="Calibration Score"
          value={modelStats?.calibration.toFixed(2) || 'N/A'}
          subtitle="Model Honesty"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ModelHealthIndicator />
        <StrategyModeDisplay />
      </div>

      <LastPredictionSummary />

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Button
              size="lg"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => navigate({ to: '/new-bet' })}
            >
              <Plus className="h-6 w-6" />
              <span className="text-base font-semibold">New Bet</span>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => navigate({ to: '/log-result' })}
            >
              <FileText className="h-6 w-6" />
              <span className="text-base font-semibold">Log Result</span>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => navigate({ to: '/history' })}
            >
              <History className="h-6 w-6" />
              <span className="text-base font-semibold">History</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => navigate({ to: '/stats' })}
            >
              <TrendingUp className="h-6 w-6" />
              <span className="text-base font-semibold">Stats</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => navigate({ to: '/settings' })}
            >
              <Settings className="h-6 w-6" />
              <span className="text-base font-semibold">Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
