"use client";

import { useEffect, useState } from "react";
import { getPostOpDuration } from "@/utils/actions";

export default function JournalPostOpStats({ entryDate }) {
  const [postOpStats, setPostOpStats] = useState(null);

  useEffect(() => {
    async function loadPostOpStats() {
      const result = await getPostOpDuration(entryDate);
      if (result.success) {
        setPostOpStats(result.data);
      }
    }

    loadPostOpStats();
  }, [entryDate]);

  if (!postOpStats) return null;

  return (
    <div className="flex items-center gap-2">
      <p className="text-md font-medium text-muted-foreground">
        {postOpStats.text}
      </p>
    </div>
  );
}
