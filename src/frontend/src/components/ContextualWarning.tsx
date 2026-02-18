import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, TrendingDown, XCircle } from 'lucide-react';

interface ContextualWarningProps {
  type: 'lowConfidence' | 'highVariance' | 'noValue';
}

const warnings = {
  lowConfidence: {
    icon: TrendingDown,
    message: 'Model confidence low: bet size reduced.',
  },
  highVariance: {
    icon: AlertTriangle,
    message: 'High variance contender: risk increased.',
  },
  noValue: {
    icon: XCircle,
    message: 'No value detected: skipping recommended.',
  },
};

export default function ContextualWarning({ type }: ContextualWarningProps) {
  const warning = warnings[type];
  const Icon = warning.icon;

  return (
    <Alert>
      <Icon className="h-4 w-4" />
      <AlertDescription>{warning.message}</AlertDescription>
    </Alert>
  );
}
