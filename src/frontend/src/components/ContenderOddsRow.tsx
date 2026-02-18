import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateImpliedProbability } from '@/lib/betting-calculations';

interface ContenderOddsRowProps {
  contenderNumber: number;
  odds: number;
  onChange: (value: number) => void;
}

export default function ContenderOddsRow({ contenderNumber, odds, onChange }: ContenderOddsRowProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value) || 1;
    value = Math.max(1, Math.min(30, value));
    onChange(value);
  };

  const impliedProb = calculateImpliedProbability(odds);

  return (
    <div className="flex items-center gap-4">
      <Label className="w-12 text-lg font-bold">#{contenderNumber}</Label>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="1"
          max="30"
          value={odds}
          onChange={handleChange}
          className="w-20 text-center text-lg font-mono"
        />
        <span className="text-lg font-mono text-muted-foreground">/1</span>
      </div>
      <div className="flex-1 text-sm text-muted-foreground">
        Implied Win Chance: <span className="font-medium text-foreground">{impliedProb.toFixed(2)}%</span>
      </div>
    </div>
  );
}
