"use client";

import { useEffect, useState } from "react";
import PostOpStats from "@/components/PostOpStats";
import StreakCounter from "@/components/journal/StreakCounter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Plus, BarChart3, Loader2 } from "lucide-react";

function formatDateForUrl(date) {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const today = new Date();
  const formattedToday = formatDateForUrl(today);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-darkb" />
          <p className="text-darkb">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-3xl">
        {/* SEO Heading - visually hidden but available to screen readers */}
        <h1 className="sr-only">ACL Journey - Track Your Recovery Progress</h1>

        <div className="space-y-6 md:space-y-8">
          {/* Header Section */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-darkb">
              Recovery Dashboard
            </h2>
            <p className="text-silver_c text-sm md:text-base">
              Track your ACL recovery progress
            </p>
          </div>

          {/* Stats Section */}
          <div className="w-full">
            <PostOpStats />
          </div>

          {/* Journal Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-darkb text-center md:text-left">
              Journal Tracking
            </h3>

            <Card className="overflow-hidden border-silver_c/20">
              <CardContent className="p-4 md:p-6">
                <div className="space-y-6">
                  {/* Streak and Progress Button */}
                  <div className="flex flex-col md:flex-row items-center gap-4 md:justify-between">
                    <div className="space-y-1 text-center md:text-left w-full md:w-auto">
                      <h4 className="text-sm font-medium text-darkb">Streak</h4>
                      <StreakCounter />
                    </div>
                    <Link href="/journal" className="w-full md:w-auto">
                      <Button
                        variant="outline"
                        className="w-full md:w-auto text-black hover:bg-black hover:text-cream border-silver_c/20 transition-all"
                        size="sm"
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        See Progress
                      </Button>
                    </Link>
                  </div>

                  {/* Add Entry Button */}
                  <div>
                    <Link href={`/journal/${formattedToday}`} className="block">
                      <Button
                        className="w-full text-sm md:text-base py-6 bg-silver_c text-black hover:bg-black hover:text-cream transition-all"
                        size="lg"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Journal Entry ({formattedToday})
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
