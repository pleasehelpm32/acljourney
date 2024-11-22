"use client";

import { useEffect, useState } from "react";
import PostOpStats from "@/components/PostOpStats";
import StreakCounter from "@/components/journal/StreakCounter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import MediumArticlesCarousel from "@/components/MediumArticlesCarousel";
import { Plus, BarChart3 } from "lucide-react";
import TodaysGamePlan from "@/components/TodaysGamePlan";
import { PageContainer } from "@/components/common/PageContainer";
import { LoadingState } from "@/components/common/LoadingState";

import { formatDateForUrl } from "@/utils/date";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const today = new Date();
  const formattedToday = formatDateForUrl(today);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingState text="Loading dashboard..." />;
  }

  return (
    <PageContainer
      title="Recovery Dashboard"
      subtitle="Track your ACL recovery progress"
    >
      <div className="space-y-8 md:space-y-12">
        {/* Stats Section */}
        <div className="w-full bg-cream rounded-3xl shadow-lg border-4 border-darkb/30 p-6 md:p-8">
          <PostOpStats />
        </div>

        <TodaysGamePlan />

        {/* Journal Section */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-darkb">
            Journal Tracking
          </h2>

          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
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
        </div>

        {/* Latest Articles Section */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-darkb">
            Latest Articles
          </h2>

          <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
            <MediumArticlesCarousel />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
