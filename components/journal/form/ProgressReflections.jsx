import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ProgressReflections({ register, handleKeyDown }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wins */}
        <div className="space-y-4">
          <Label className="text-darkb">Three Wins Today</Label>
          {[0, 1, 2].map((index) => (
            <Input
              key={index}
              {...register(`wins.${index}`)}
              onKeyDown={handleKeyDown}
              placeholder={`Win #${index + 1}`}
              className="border-silver_c/20 text-black placeholder:text-gray-400"
            />
          ))}
        </div>

        {/* Reflections */}
        <div className="space-y-4">
          <Label className="text-darkb">Reflections</Label>
          <div className="space-y-4">
            <Input
              {...register("biggestChallenge")}
              onKeyDown={handleKeyDown}
              placeholder="What challenged you today?"
              className="border-silver_c/20 text-black placeholder:text-gray-400"
            />
            <Input
              {...register("lessonLearned")}
              onKeyDown={handleKeyDown}
              placeholder="What did you learn?"
              className="border-silver_c/20 text-black placeholder:text-gray-400"
            />
            <Input
              {...register("improvement")}
              onKeyDown={handleKeyDown}
              placeholder="What could be better?"
              className="border-silver_c/20 text-black placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-darkb">Brain Dump</Label>
        <Textarea
          {...register("brainDump")}
          placeholder="Use this space for any additional thoughts, feelings, or notes about your day..."
          className="min-h-[150px] border-silver_c/20 text-black placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}
