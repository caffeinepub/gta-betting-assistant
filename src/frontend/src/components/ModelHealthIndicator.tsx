import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';
import { useGetModelStats } from '@/hooks/useQueries';

export default function ModelHealthIndicator() {
  const { data: modelStats } = useGetModelStats();

  const confidenceLevel = modelStats?.confidenceLevel || 'Medium';
  const recentAccuracy = modelStats?.recentAccuracy || 0;

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Model Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Confidence Level</span>
          <Badge className={getConfidenceColor(confidenceLevel)}>{confidenceLevel}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Recent Accuracy</span>
          <span className="text-sm font-medium">{(recentAccuracy * 100).toFixed(1)}%</span>
        </div>
        {confidenceLevel === 'Low' && (
          <p className="text-xs text-muted-foreground border-t pt-3">
            Model confidence is low. Bet sizes will be automatically reduced until performance improves.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
