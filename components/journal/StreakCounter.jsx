// components/journal/StreakCounter.jsx
"use client";

import { Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { calculateStreak } from "@/utils/actions";

export default function StreakCounter() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    async function getStreak() {
      const result = await calculateStreak();
      if (result.success) {
        setStreak(result.data);
      }
    }

    getStreak();
  }, []);

  return (
    <div className="flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-lg w-fit">
      <Flame className={`h-5 w-5 ${streak > 0 ? "animate-pulse" : ""}`} />
      <span className="font-medium">
        Current streak: {streak} day{streak !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
