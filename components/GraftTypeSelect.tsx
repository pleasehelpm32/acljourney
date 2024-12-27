import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";

interface GraftTypeSelectProps {
  value: string | null | undefined;
  onChange: (value: string) => void;
}

export default function GraftTypeSelect({
  value,
  onChange,
}: GraftTypeSelectProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">Graft Type</Label>
      <Select value={value || ""} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select your graft type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="patellar">Patellar Tendon Autograft</SelectItem>
          <SelectItem value="hamstring">Hamstring Tendon Autograft</SelectItem>
          <SelectItem value="quadriceps">
            Quadriceps Tendon Autograft
          </SelectItem>
          <SelectItem value="allograft">Allograft (Donor)</SelectItem>
          <SelectItem value="synthetic">Synthetic Graft</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
