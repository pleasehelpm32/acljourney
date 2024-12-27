"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getPostOpDuration } from "@/utils/actions";
import { Loader2, AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PostOpDuration } from "@/types/actions";

interface EmptyStateProps {
  message?: string;
}

function EmptyState({ message = "No stats available" }: EmptyStateProps) {
  return (
    <Card className="p-6 bg-gray-50">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <AlertCircle className="h-8 w-8 text-gray-400" />
        <div className="space-y-2">
          <h3 className="text-lg font-medium">{message}</h3>
          <p className="text-sm text-gray-500">
            Please configure your surgery date in settings
          </p>
        </div>
        <Link href="/settings">
          <Button variant="outline">Configure Settings</Button>
        </Link>
      </div>
    </Card>
  );
}

export default function PostOpStats() {
  const [postOpStats, setPostOpStats] = useState<PostOpDuration | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDaysOnly, setShowDaysOnly] = useState<boolean>(false);

  useEffect(() => {
    async function loadPostOpStats() {
      try {
        const result = await getPostOpDuration();
        if (result.success && result.data) {
          setPostOpStats(result.data);
        }
      } catch (error) {
        console.error("Error loading post-op stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPostOpStats();
    // Update stats every hour
    const interval = setInterval(loadPostOpStats, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, []);

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
