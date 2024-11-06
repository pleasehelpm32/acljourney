import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function KneeSelector() {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">Which Knee</Label>
      <RadioGroup defaultValue="right" className="flex gap-4">
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
