import { Flame } from "lucide-react";

export default function StreakCounter({ streak = 0 }) {
  return (
    <div className="flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-lg w-fit">
      <Flame className="h-5 w-5" />
      <span className="font-medium">Current streak: {streak} days</span>
    </div>
  );
}
