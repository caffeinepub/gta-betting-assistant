import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function SkipRaceRecommendation() {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Recommendation: Skip This Race</AlertTitle>
      <AlertDescription>
        No contender shows a strong positive expected value. It's better to wait for a more favorable opportunity.
      </AlertDescription>
    </Alert>
  );
}
