import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { useGetUserSettings } from '@/hooks/useQueries';

const modeDescriptions: Record<string, string> = {
  Safe: 'Optimizing for highest win consistency',
  Balanced: 'Balancing probability and value',
  Value: 'Prioritizing expected value and underdog opportunities',
  Aggressive: 'Maximizing payout potential',
};

export default function StrategyModeDisplay() {
  const { data: settings } = useGetUserSettings();
  const mode = settings?.strategyMode || 'Balanced';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Strategy Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-2xl font-bold">{mode} Mode</div>
        <p className="text-sm text-muted-foreground">{modeDescriptions[mode]}</p>
      </CardContent>
    </Card>
  );
}
