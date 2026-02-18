import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface StrategyModeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const modes = [
  {
    value: 'Safe',
    label: 'Safe Mode',
    description: 'Prioritizes highest win likelihood with low volatility',
  },
  {
    value: 'Balanced',
    label: 'Balanced Mode',
    description: 'Balances probability and value for consistent profit',
  },
  {
    value: 'Value',
    label: 'Value Mode',
    description: 'Seeks underpriced contenders with positive expected value',
  },
  {
    value: 'Aggressive',
    label: 'Aggressive Mode',
    description: 'Maximizes potential payout, accepts lower win rate',
  },
];

export default function StrategyModeSelector({ value, onChange }: StrategyModeSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Strategy Mode</CardTitle>
        <CardDescription>Choose your betting approach</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={value} onValueChange={onChange}>
          <div className="grid gap-3">
            {modes.map((mode) => (
              <div key={mode.value} className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem value={mode.value} id={mode.value} />
                <Label htmlFor={mode.value} className="cursor-pointer flex-1">
                  <div className="font-medium">{mode.label}</div>
                  <div className="text-sm text-muted-foreground">{mode.description}</div>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
