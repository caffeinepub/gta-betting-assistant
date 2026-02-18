import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { SessionSummaryData } from '@/hooks/useSessionTracking';

interface SessionSummaryModalProps {
  open: boolean;
  onClose: () => void;
  data: SessionSummaryData | null;
}

export default function SessionSummaryModal({ open, onClose, data }: SessionSummaryModalProps) {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Session Summary</DialogTitle>
          <DialogDescription>
            Performance review for the last {data.raceCount} races
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Session Profit/Loss</p>
              <p className={`text-2xl font-bold ${data.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {data.profitLoss >= 0 ? '+' : ''}${data.profitLoss.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Best Performer</p>
              <p className="text-2xl font-bold">#{data.bestContender}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Worst Performer</p>
              <p className="text-2xl font-bold">#{data.worstContender}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Most Accurate Mode</p>
              <p className="text-2xl font-bold">{data.mostAccurateMode}</p>
            </CardContent>
          </Card>
        </div>
        <Button onClick={onClose} className="w-full">
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
}
