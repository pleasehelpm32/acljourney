//components/PostOpStats
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getPostOpDuration } from "@/utils/actions";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PostOpStats() {
  const [postOpStats, setPostOpStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-darkb text-center md:text-left">
          Recovery Timeline
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="relative overflow-hidden border-silver_c/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col items-center justify-center space-y-2">
                <span className="text-3xl md:text-4xl font-bold text-darkb">
                  ?
                </span>
                <span className="text-sm md:text-base text-silver_c font-medium">
                  Weeks
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-silver_c/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col items-center justify-center space-y-2">
                <span className="text-3xl md:text-4xl font-bold text-darkb">
                  ?
                </span>
                <span className="text-sm md:text-base text-silver_c font-medium">
                  Days
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 sm:col-span-2 relative overflow-hidden border-silver_c/20">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center gap-2 text-silver_c">
                  <AlertCircle className="h-5 w-5" />
                  <span>Surgery date not set</span>
                </div>
                <Link href="/settings" className="w-full sm:w-auto">
                  <Button
                    className="w-full sm:w-auto text-sm md:text-base py-2 bg-silver_c text-black hover:bg-black hover:text-cream transition-all"
                    size="lg"
                  >
                    Go to Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-darkb text-center md:text-left">
        Recovery Timeline
      </h3>
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
    </div>
  );
}
