import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateImpliedProbability } from '@/lib/betting-calculations';

interface ContenderOddsRowProps {
  contenderNumber: number;
  odds: number | '';
  onChange: (value: number | '') => void;
}

export default function ContenderOddsRow({ contenderNumber, odds, onChange }: ContenderOddsRowProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty string
    if (inputValue === '') {
      onChange('');
      return;
    }
    
    // Parse and validate numeric input
    const numValue = parseInt(inputValue);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(1, Math.min(30, numValue));
      onChange(clampedValue);
    }
  };

  // Only calculate implied probability if we have a valid number
  const hasValidOdds = typeof odds === 'number' && odds >= 1 && odds <= 30;
  const impliedProb = hasValidOdds ? calculateImpliedProbability(odds) : null;

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
          placeholder=""
          className="w-20 text-center text-lg font-mono"
        />
        <span className="text-lg font-mono text-muted-foreground">/1</span>
      </div>
      <div className="flex-1 text-sm text-muted-foreground">
        {impliedProb !== null ? (
          <>
            Implied Win Chance: <span className="font-medium text-foreground">{impliedProb.toFixed(2)}%</span>
          </>
        ) : (
          <span className="text-muted-foreground/50">Enter odds to see probability</span>
        )}
      </div>
    </div>
  );
}
