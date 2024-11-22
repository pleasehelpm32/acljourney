import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const LEVELS = [0, 1, 2, 3, 4, 5];
const SWELLING_OPTIONS = ["None", "Mild", "Moderate", "Severe"];

export const PhysicalStatus = forwardRef(
  ({ control, register, errors, handleKeyDown }, ref) => {
    return (
      <div className="space-y-6">
        {/* Pain Scale */}
        <div className="space-y-3">
          <Label className="text-darkb">Knee Pain Level</Label>
          <Controller
            name="painLevel"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-6 gap-2">
                {LEVELS.map((level) => (
                  <Button
                    key={level}
                    type="button"
                    variant="outline"
                    onClick={() => field.onChange(level)}
                    className={cn(
                      "h-12 w-full font-semibold transition-all hover:bg-silver_c/20",
                      field.value === level
                        ? `bg-gradient-to-r ${
                            level >= 4
                              ? "from-red-500 to-red-600"
                              : level >= 2
                              ? "from-yellow-500 to-yellow-600"
                              : "from-green-500 to-green-600"
                          } text-white`
                        : "text-black"
                    )}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            )}
          />
          <div className="flex justify-between text-sm text-black">
            <span>None</span>
            <span>Severe</span>
          </div>
        </div>

        {/* Swelling */}
        <div className="space-y-3" ref={ref}>
          <Label className="text-darkb">Swelling</Label>
          <Controller
            name="swelling"
            control={control}
            rules={{ required: "Please select swelling level" }}
            render={({ field }) => (
              <div className="space-y-3">
                <RadioGroup
                  className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {SWELLING_OPTIONS.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={option.toLowerCase()}
                        id={option.toLowerCase()}
                      />
                      <Label
                        htmlFor={option.toLowerCase()}
                        className="text-black"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.swelling && (
                  <div className="text-sm text-red-500 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {errors.swelling.message}
                  </div>
                )}
              </div>
            )}
          />
        </div>

        {/* Knee Measurements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-darkb">Knee Flexion</Label>
            <Input
              {...register("kneeFlexion")}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Full, 130°, Limited to 90°"
              className="border-silver_c/20 text-black placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-darkb">Knee Extension</Label>
            <Input
              {...register("kneeExtension")}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Full, -5°, Limited by 10°"
              className="border-silver_c/20 text-black placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>
    );
  }
);

PhysicalStatus.displayName = "PhysicalStatus";
