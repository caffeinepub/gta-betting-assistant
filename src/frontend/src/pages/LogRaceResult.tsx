import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import FinishingPositionSelector from '@/components/FinishingPositionSelector';
import { useGetRaceHistory, useUpdateRaceOutcome } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import { Save } from 'lucide-react';

export default function LogRaceResult() {
  const navigate = useNavigate();
  const { data: raceHistory = [] } = useGetRaceHistory();
  const updateOutcome = useUpdateRaceOutcome();

  const [winner, setWinner] = useState<number>(1);
  const [secondPlace, setSecondPlace] = useState<number>(2);
  const [thirdPlace, setThirdPlace] = useState<number>(3);
  const [followedRecommendation, setFollowedRecommendation] = useState(true);

  const lastRaceIndex = raceHistory.length - 1;
  const lastRace = raceHistory[lastRaceIndex];
  const hasUnfinishedRace = lastRace && !lastRace.outcome;

  const handleSave = async () => {
    if (!hasUnfinishedRace) {
      toast.error('No pending race to log');
      return;
    }

    if (winner === secondPlace || winner === thirdPlace || secondPlace === thirdPlace) {
      toast.error('Each position must have a different contender');
      return;
    }

    try {
      await updateOutcome.mutateAsync({
        raceIndex: lastRaceIndex,
        winner: BigInt(winner),
        secondPlace: BigInt(secondPlace),
        thirdPlace: BigInt(thirdPlace),
      });

      toast.success('Race result saved successfully!');
      navigate({ to: '/' });
    } catch (error) {
      toast.error('Failed to save race result');
      console.error(error);
    }
  };

  if (!hasUnfinishedRace) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Log Race Result</h2>
          <p className="text-muted-foreground">Record the outcome of your last race</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No pending race to log. Create a new bet first.
            </p>
            <Button className="w-full mt-4" onClick={() => navigate({ to: '/new-bet' })}>
              Create New Bet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Log Race Result</h2>
        <p className="text-muted-foreground">Record the outcome of your last race</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Last Race Details</CardTitle>
          <CardDescription>
            Recommended: #{Number(lastRace.modelPrediction)} · Bet Size: ${Number(lastRace.betSize).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <FinishingPositionSelector
              label="Winner"
              value={winner}
              onChange={setWinner}
            />
            <FinishingPositionSelector
              label="Second Place"
              value={secondPlace}
              onChange={setSecondPlace}
            />
            <FinishingPositionSelector
              label="Third Place"
              value={thirdPlace}
              onChange={setThirdPlace}
            />
          </div>

          <div className="flex items-center space-x-2 pt-4 border-t">
            <Switch
              id="followed"
              checked={followedRecommendation}
              onCheckedChange={setFollowedRecommendation}
            />
            <Label htmlFor="followed" className="cursor-pointer">
              I followed the recommendation
            </Label>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={handleSave}
            disabled={updateOutcome.isPending}
          >
            <Save className="mr-2 h-5 w-5" />
            {updateOutcome.isPending ? 'Saving...' : 'Save Race Result'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
