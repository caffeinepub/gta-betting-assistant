import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FinishingPositionSelectorProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export default function FinishingPositionSelector({
  label,
  value,
  onChange,
}: FinishingPositionSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value.toString()} onValueChange={(v) => onChange(parseInt(v))}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <SelectItem key={num} value={num.toString()}>
              #{num}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
