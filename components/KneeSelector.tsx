import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";

interface KneeSelectorProps {
  value: string | null | undefined;
  onChange: (value: string) => void;
}

export default function KneeSelector({ value, onChange }: KneeSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">Which Knee</Label>
      <RadioGroup
        value={value || ""}
        onValueChange={onChange}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="right" id="right" />
          <Label htmlFor="right">Right</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="left" id="left" />
          <Label htmlFor="left">Left</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
