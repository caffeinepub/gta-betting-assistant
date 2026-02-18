import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { calculateTotalImpliedProbability, calculateOverround } from '@/lib/betting-calculations';

interface OddsSummaryPanelProps {
  odds: number[];
}

export default function OddsSummaryPanel({ odds }: OddsSummaryPanelProps) {
  const totalImplied = calculateTotalImpliedProbability(odds);
  const overround = calculateOverround(totalImplied);
  const isAbnormal = totalImplied > 150 || totalImplied < 80;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Odds Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Implied Probability</span>
          <span className="text-lg font-bold">{totalImplied.toFixed(2)}%</span>
        </div>
        {totalImplied > 100 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Overround</span>
            <span className="text-lg font-bold text-yellow-500">{overround.toFixed(2)}%</span>
          </div>
        )}
        {isAbnormal && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Warning: Total implied probability is abnormal. Please verify your odds entries.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
