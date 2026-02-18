import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RaceEntry } from '@/backend';

interface RaceHistoryEntryProps {
  race: RaceEntry;
  index: number;
}

export default function RaceHistoryEntry({ race, index }: RaceHistoryEntryProps) {
  const recommendedContender = Number(race.modelPrediction);
  const betSize = Number(race.betSize);
  const outcome = race.outcome;

  let status = 'Pending';
  let statusColor = 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
  let profit = 0;

  if (outcome) {
    const winner = Number(outcome.winner);
    if (winner === recommendedContender) {
      status = 'Won';
      statusColor = 'bg-green-500/10 text-green-500 border-green-500/20';
      profit = betSize * race.odds[recommendedContender - 1];
    } else {
      status = 'Lost';
      statusColor = 'bg-red-500/10 text-red-500 border-red-500/20';
      profit = -betSize;
    }
  }

  const date = new Date(Number(race.timestamp) / 1000000);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <div>
            <p className="text-xs text-muted-foreground">Date</p>
            <p className="text-sm font-medium">{date.toLocaleDateString()}</p>
            <p className="text-xs text-muted-foreground">{date.toLocaleTimeString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Recommended</p>
            <p className="text-lg font-bold">#{recommendedContender}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Bet Size</p>
            <p className="text-sm font-medium">${betSize.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <Badge className={statusColor}>{status}</Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Result</p>
            {outcome ? (
              <p className="text-sm font-medium">
                {Number(outcome.winner)}-{Number(outcome.secondPlace)}-{Number(outcome.thirdPlace)}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">-</p>
            )}
          </div>
          <div>
            <p className="text-xs text-muted-foreground">P/L</p>
            <p className={`text-sm font-bold ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {profit >= 0 ? '+' : ''}${profit.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
