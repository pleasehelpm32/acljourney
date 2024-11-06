import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProfileForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label htmlFor="sport" className="text-sm font-medium text-gray-700">
          Favorite Sport (Optional)
        </Label>
        <Input
          id="sport"
          placeholder="Enter your favorite sport"
          className="max-w-md"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="about" className="text-sm font-medium text-gray-700">
          About (Optional)
        </Label>
        <Textarea
          id="about"
          placeholder="Share a bit about yourself and your recovery journey"
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}
