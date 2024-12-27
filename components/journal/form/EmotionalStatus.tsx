import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Controller, Control } from "react-hook-form";
import { CreateJournalEntryInput } from "@/types/actions";

interface EmotionalStatusProps {
  control: Control<CreateJournalEntryInput>;
  selectedEmotion: number | null;
  onEmotionChange: (emotion: number) => void;
}

const EMOTIONS = ["😭", "🙁", "😐", "🙂", "😃"];
const LEVELS = [0, 1, 2, 3, 4, 5];

export function EmotionalStatus({
  control,
  selectedEmotion,
  onEmotionChange,
}: EmotionalStatusProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-darkb">Today I feel...</Label>
        <div className="grid grid-cols-5 gap-2 md:gap-4">
          {EMOTIONS.map((emoji, index) => (
            <Button
              key={index}
              type="button"
              variant="outline"
              className={cn(
                "text-2xl h-12 w-full transition-all hover:scale-105 hover:bg-silver_c/20",
                selectedEmotion === index && "border-darkb border-2 shadow-md"
              )}
              onClick={() => onEmotionChange(index)}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-darkb">Energy Level</Label>
        <Controller
          name="energyLevel"
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
                          level <= 1
                            ? "from-red-500 to-red-600"
                            : level <= 3
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
          <span>Very Drained</span>
          <span>Energized</span>
        </div>
      </div>
    </div>
  );
}
