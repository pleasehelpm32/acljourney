import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";

interface WeightBearingStatusProps {
  value: string | null | undefined;
  onChange: (value: string) => void;
}

export default function WeightBearingStatus({
  value,
  onChange,
}: WeightBearingStatusProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">
        Weight Bearing Status
      </Label>
      <RadioGroup
        value={value || ""}
        onValueChange={onChange}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="weight-bearing" id="weight-bearing" />
          <Label htmlFor="weight-bearing">Weight Bearing</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="non-weight-bearing" id="non-weight-bearing" />
          <Label htmlFor="non-weight-bearing">Non-Weight Bearing</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
