import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ContenderOddsRow from '@/components/ContenderOddsRow';
import OddsSummaryPanel from '@/components/OddsSummaryPanel';
import StrategyModeSelector from '@/components/StrategyModeSelector';
import PredictionResults from '@/components/PredictionResults';
import ReasoningPanel from '@/components/ReasoningPanel';
import SkipRaceRecommendation from '@/components/SkipRaceRecommendation';
import ContextualWarning from '@/components/ContextualWarning';
import { usePrediction } from '@/hooks/usePrediction';
import { Calculator } from 'lucide-react';

export default function NewBet() {
  const [odds, setOdds] = useState<(number | '')[]>(['', '', '', '', '', '']);
  const [strategyMode, setStrategyMode] = useState<string>('Balanced');
  const [showResults, setShowResults] = useState(false);

  const { prediction, isCalculating, calculate } = usePrediction();

  const handleOddsChange = (index: number, value: number | '') => {
    const newOdds = [...odds];
    newOdds[index] = value;
    setOdds(newOdds);
    setShowResults(false);
  };

  const handleCalculate = async () => {
    // Convert odds to numbers for calculation, filtering out empty values
    const validOdds = odds.map(odd => typeof odd === 'number' ? odd : 0);
    await calculate(validOdds, strategyMode);
    setShowResults(true);
  };

  // Check if all odds are filled with valid numbers
  const allOddsFilled = odds.every((odd) => typeof odd === 'number' && odd >= 1 && odd <= 30);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">New Bet</h2>
        <p className="text-muted-foreground">Enter race odds and get intelligent predictions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Race Odds Entry</CardTitle>
          <CardDescription>Enter the odds numerator for each contender (1-30)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <ContenderOddsRow
              key={index}
              contenderNumber={index + 1}
              odds={odds[index]}
              onChange={(value) => handleOddsChange(index, value)}
            />
          ))}
        </CardContent>
      </Card>

      <OddsSummaryPanel odds={odds.map(odd => typeof odd === 'number' ? odd : 0)} />

      <StrategyModeSelector value={strategyMode} onChange={setStrategyMode} />

      <Button
        size="lg"
        className="w-full"
        onClick={handleCalculate}
        disabled={!allOddsFilled || isCalculating}
      >
        <Calculator className="mr-2 h-5 w-5" />
        {isCalculating ? 'Calculating...' : 'Calculate Best Bet'}
      </Button>

      {showResults && prediction && (
        <>
          {prediction.shouldSkip ? (
            <SkipRaceRecommendation />
          ) : (
            <>
              {prediction.warnings.map((warning, idx) => (
                <ContextualWarning key={idx} type={warning} />
              ))}
              <PredictionResults prediction={prediction} />
              <ReasoningPanel signals={prediction.signals} weights={prediction.weights} />
            </>
          )}
        </>
      )}
    </div>
  );
}
