import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function MindsetWellbeing({ register, errors, focusFieldRef }) {
  return (
    <div className="space-y-6">
      <div className="space-y-3" ref={focusFieldRef}>
        <Label className="text-darkb">My biggest focus today is</Label>
        <Textarea
          {...register("focus", {
            required: "Please enter your main focus",
            onChange: (e) => {
              e.target.value = e.target.value;
            },
          })}
          placeholder="Enter your main focus for today..."
          className={cn(
            "border-silver_c/20 text-black placeholder:text-gray-400",
            errors.focus && "border-red-500 focus:border-red-500"
          )}
        />
        {errors.focus && (
          <div className="text-sm text-red-500 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {errors.focus.message}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Label className="text-darkb">
          One thing I am doing for me today is
        </Label>
        <Textarea
          {...register("selfCare")}
          placeholder="What are you doing for self-care today?"
          className="border-silver_c/20 text-black placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}
