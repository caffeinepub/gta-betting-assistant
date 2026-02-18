import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

interface Signal {
  name: string;
  score: number;
}

interface ReasoningPanelProps {
  signals: Signal[];
  weights: Record<string, number>;
}

export default function ReasoningPanel({ signals, weights }: ReasoningPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Reasoning Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {signals.map((signal) => (
            <div key={signal.name} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{signal.name}</span>
                <span className={`text-sm font-bold ${signal.score >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {signal.score >= 0 ? '+' : ''}{signal.score.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Weight</span>
                <span>{weights[signal.name]?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
