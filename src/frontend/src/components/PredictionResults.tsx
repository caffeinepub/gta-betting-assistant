import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import type { PredictionResult } from '@/hooks/usePrediction';

interface PredictionResultsProps {
  prediction: PredictionResult;
}

export default function PredictionResults({ prediction }: PredictionResultsProps) {
  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Low':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    }
  };

  return (
    <Card className="border-primary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Prediction Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Recommended Bet</p>
            <p className="text-3xl font-bold">#{prediction.recommendedContender}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Predicted Win Probability</p>
            <p className="text-3xl font-bold">{prediction.predictedProbability.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Implied Odds Probability</p>
            <p className="text-3xl font-bold">{prediction.impliedProbability.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Value Edge</p>
            <p className={`text-3xl font-bold ${prediction.edge >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {prediction.edge >= 0 ? '+' : ''}{prediction.edge.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Confidence Level</p>
            <Badge className={`text-lg ${getConfidenceColor(prediction.confidenceLevel)}`}>
              {prediction.confidenceLevel}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Recommended Bet Size</p>
            <p className="text-3xl font-bold">${prediction.betSize.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
