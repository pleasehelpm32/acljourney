//components/PostOpStats
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getPostOpDuration } from "@/utils/actions";
import { Loader2, AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PostOpStats() {
  const [postOpStats, setPostOpStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDaysOnly, setShowDaysOnly] = useState(false);

  useEffect(() => {
    async function loadPostOpStats() {
      const result = await getPostOpDuration();
      if (result.success) {
        setPostOpStats(result.data);
      }
      setIsLoading(false);
    }

    loadPostOpStats();
    // Update stats every hour
    const interval = setInterval(loadPostOpStats, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-6 w-6 animate-spin text-darkb" />
      </div>
    );
  }
  if (!postOpStats) {
    return <EmptyState />;
  }

  const totalDays = postOpStats.weeks * 7 + postOpStats.days;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-darkb text-center md:text-left">
          Recovery Timeline
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowDaysOnly(!showDaysOnly)}
          className="hover:bg-transparent"
        >
          <RefreshCcw
            className={`h-5 w-5 text-darkb transition-transform duration-300 ${
              showDaysOnly ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>

      {showDaysOnly ? (
        // Days only view
        <Card className="relative overflow-hidden border-silver_c/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col items-center justify-center space-y-2">
              <span className="text-3xl md:text-4xl font-bold text-darkb">
                {totalDays}
              </span>
              <span className="text-sm md:text-base text-silver_c font-medium">
                Days Post Surgery
              </span>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Original weeks/days view
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="relative overflow-hidden border-silver_c/20">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col items-center justify-center space-y-2">
                <span className="text-3xl md:text-4xl font-bold text-darkb">
                  {postOpStats.weeks}
                </span>
                <span className="text-sm md:text-base text-silver_c font-medium">
                  {postOpStats.weeks === 1 ? "Week" : "Weeks"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-silver_c/20">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col items-center justify-center space-y-2">
                <span className="text-3xl md:text-4xl font-bold text-darkb">
                  {postOpStats.days}
                </span>
                <span className="text-sm md:text-base text-silver_c font-medium">
                  {postOpStats.days === 1 ? "Day" : "Days"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
