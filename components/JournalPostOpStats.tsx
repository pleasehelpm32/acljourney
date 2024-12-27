"use client";

import { useEffect, useState } from "react";
import { getPostOpDuration } from "@/utils/actions";
import { PostOpDuration } from "@/types/actions";

interface JournalPostOpStatsProps {
  entryDate: string;
}

export default function JournalPostOpStats({
  entryDate,
}: JournalPostOpStatsProps) {
  const [postOpStats, setPostOpStats] = useState<PostOpDuration | null>(null);

  useEffect(() => {
    async function loadPostOpStats() {
      try {
        const result = await getPostOpDuration(entryDate);
        if (result.success && result.data) {
          setPostOpStats(result.data);
        }
      } catch (error) {
        console.error("Error loading post-op stats:", error);
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
