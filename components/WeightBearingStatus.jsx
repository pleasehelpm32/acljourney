import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function WeightBearingStatus() {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">
        Weight Bearing Status
      </Label>
      <RadioGroup defaultValue="non-weight-bearing" className="flex gap-4">
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
