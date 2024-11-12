// app/page.js
"use client";

import PostOpStats from "@/components/PostOpStats";
import StreakCounter from "@/components/journal/StreakCounter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Plus, BarChart3 } from "lucide-react"; // Changed to BarChart3 which is definitely available

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
  const today = new Date();
  const formattedToday = formatDateForUrl(today);

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Recovery Dashboard</h1>
          <p className="text-muted-foreground">
            Track your ACL recovery progress
          </p>
        </div>

        <PostOpStats />

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-muted-foreground">
            Journal Tracking
          </h3>

          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Streak
                    </h4>
                    <StreakCounter />
                  </div>
                  <Link href="/journal">
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      See Progress
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  <Link href={`/journal/${formattedToday}`}>
                    <Button className="w-full" size="lg">
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
  );
}
