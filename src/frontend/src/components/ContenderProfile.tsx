import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ContenderStats } from '@/lib/contender-calculations';

interface ContenderProfileProps {
  contenderNumber: number;
  stats: ContenderStats;
}

export default function ContenderProfile({ contenderNumber, stats }: ContenderProfileProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Contender #{contenderNumber}</span>
          <Badge variant="outline">{stats.totalRaces} races</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Win</p>
            <p className="text-lg font-bold">{stats.winRate.toFixed(0)}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Place</p>
            <p className="text-lg font-bold">{stats.placeRate.toFixed(0)}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Show</p>
            <p className="text-lg font-bold">{stats.showRate.toFixed(0)}%</p>
          </div>
        </div>

        <div className="space-y-1 border-t pt-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last 5 Finishes</span>
            <span className="font-mono">{stats.lastFiveFinishes.join('-') || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current Streak</span>
            <span className="font-medium">{stats.streak}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Avg Implied Odds</span>
            <span className="font-medium">{stats.avgImpliedOdds.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Consistency Score</span>
            <span className="font-medium">{stats.consistencyScore.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
