import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { useGetRaceHistory } from '@/hooks/useQueries';
import { calculateImpliedProbability } from '@/lib/betting-calculations';

export default function LastPredictionSummary() {
  const { data: raceHistory = [] } = useGetRaceHistory();

  if (raceHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Last Prediction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No predictions yet. Create your first bet!</p>
        </CardContent>
      </Card>
    );
  }

  const lastRace = raceHistory[raceHistory.length - 1];
  const recommendedContender = Number(lastRace.modelPrediction);
  const betSize = Number(lastRace.betSize);
  const outcome = lastRace.outcome;

  let status = 'Pending';
  let statusColor = 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
  let profit = 0;

  if (outcome) {
    const winner = Number(outcome.winner);
    const secondPlace = Number(outcome.secondPlace);
    const thirdPlace = Number(outcome.thirdPlace);

    if (winner === recommendedContender) {
      status = 'Won';
      statusColor = 'bg-green-500/10 text-green-500 border-green-500/20';
      const odds = lastRace.odds[recommendedContender - 1];
      profit = betSize * odds;
    } else if (secondPlace === recommendedContender) {
      status = 'Placed';
      statusColor = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      profit = -betSize;
    } else if (thirdPlace === recommendedContender) {
      status = 'Showed';
      statusColor = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      profit = -betSize;
    } else {
      status = 'Failed';
      statusColor = 'bg-red-500/10 text-red-500 border-red-500/20';
      profit = -betSize;
    }
  }

  const impliedProb = calculateImpliedProbability(lastRace.odds[recommendedContender - 1]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Last Prediction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <p className="text-xs text-muted-foreground">Recommended</p>
            <p className="text-lg font-bold">#{recommendedContender}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Implied Probability</p>
            <p className="text-lg font-bold">{impliedProb.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Bet Size</p>
            <p className="text-lg font-bold">${betSize.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <Badge className={statusColor}>{status}</Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Profit/Loss</p>
            <p className={`text-lg font-bold ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {profit >= 0 ? '+' : ''}${profit.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
