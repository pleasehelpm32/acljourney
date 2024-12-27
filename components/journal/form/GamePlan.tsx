import { UseFormRegister } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreateJournalEntryInput } from "@/types/actions";

interface GamePlanProps {
  register: UseFormRegister<CreateJournalEntryInput>;
}

const TIME_BLOCKS = [
  {
    id: "morning",
    label: "Morning",
    placeholder: "e.g., Ice therapy, gentle stretches, work from home...",
  },
  {
    id: "midDay",
    label: "Mid-Day",
    placeholder: "e.g., PT appointment, walking practice, lunch...",
  },
  {
    id: "afternoon",
    label: "Afternoon",
    placeholder: "e.g., Exercise session, work tasks, rest period...",
  },
  {
    id: "evening",
    label: "Evening",
    placeholder: "e.g., Recovery exercises, elevation time, sleep prep...",
  },
] as const;

export function GamePlan({ register }: GamePlanProps) {
  return (
    <div className="space-y-6">
      {TIME_BLOCKS.map((block) => (
        <div key={block.id} className="space-y-3">
          <Label className="text-darkb">{block.label}</Label>
          <Textarea
            {...register(`timeBlockPlans.${block.id}`)}
            placeholder={block.placeholder}
            rows={2}
            className="resize-none border-silver_c/20 text-black placeholder:text-gray-400"
          />
        </div>
      ))}
    </div>
  );
}
