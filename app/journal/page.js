"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Plus, Save } from "lucide-react";
import Link from "next/link";
import { getJournalWeeks } from "@/utils/actions";
import { useToast } from "@/hooks/use-toast";
import {
  createSafeDate,
  formatDateForUrl,
  isSameDay,
  getToday,
} from "@/utils/date";

import StreakCounter from "@/components/journal/StreakCounter";
import WeekAccordion from "@/components/journal/WeekAccordion";

export default function JournalPage() {
  const [pageState, setPageState] = useState({
    date: getToday(),
    expandedWeeks: [],
    weeks: [],
    isLoading: true,
  });
  const { toast } = useToast();

  const today = getToday();
  const formattedToday = formatDateForUrl(today);

  useEffect(() => {
    async function loadJournalWeeks() {
      try {
        const result = await getJournalWeeks();

        if (result.success) {
          setPageState((prev) => ({
            ...prev,
            weeks: result.data || [],
            expandedWeeks: result.data?.length > 0 ? [result.data[0].id] : [],
            isLoading: false,
          }));
        } else {
          throw new Error(result.error || "Failed to load journal entries");
        }
      } catch (error) {
        console.error("Component error:", error);
        toast({
          title: "Error",
          description: "Unable to load journal entries. Please try again.",
          variant: "destructive",
        });
        setPageState((prev) => ({ ...prev, isLoading: false }));
      }
    }

    loadJournalWeeks();
  }, [toast]);

  const findWeekForDate = (date) => {
    return pageState.weeks.find((week) => {
      const clickedDate = createSafeDate(date);
      const startDate = createSafeDate(week.startDate);
      const endDate = createSafeDate(week.endDate);

      return clickedDate >= startDate && clickedDate <= endDate;
    });
  };

  const getEntryStatus = (date) => {
    const week = findWeekForDate(date);
    if (!week) return null;

    const localDate = createSafeDate(date);
    return week.entries[localDate.getDay()];
  };

  const handleDateSelect = (newDate) => {
    if (!newDate) return;

    const selectedWeek = findWeekForDate(newDate);
    setPageState((prev) => ({
      ...prev,
      date: newDate,
      expandedWeeks: selectedWeek
        ? [...new Set([...prev.expandedWeeks, selectedWeek.id])]
        : prev.expandedWeeks,
    }));
  };

  if (pageState.isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-3xl flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Save className="h-8 w-8 animate-spin text-darkb" />
          <p className="text-darkb">Loading journal entries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-3xl">
        <h1 className="sr-only">ACL Journey - Recovery Journal</h1>

        <div className="flex flex-col space-y-6 mb-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-darkb mb-2">
              Recovery Journal
            </h2>
            <p className="text-silver_c text-sm md:text-base">
              Track your daily progress and milestones
            </p>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="w-full lg:w-auto space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-silver_c/20">
                <h3 className="text-lg font-medium text-darkb mb-3">
                  Current Progress
                </h3>
                <StreakCounter />
              </div>

              <Link href={`/journal/${formattedToday}`} className="block">
                <Button
                  className="w-full bg-silver_c text-black hover:bg-black hover:text-cream transition-all py-6"
                  size="lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Journal Entry ({formattedToday})
                </Button>
              </Link>
            </div>

            <div className="w-full lg:w-auto">
              <Calendar
                mode="single"
                selected={pageState.date}
                onSelect={handleDateSelect}
                className="rounded-lg border border-silver_c/20 bg-white p-3"
                modifiersClassNames={{
                  selected:
                    "border-2 border-darkb text-darkb hover:bg-cream/50 focus:bg-cream/50",
                  today: "bg-cream text-darkb",
                  completed: "bg-green-100 text-green-600 font-medium",
                  missed: "bg-red-100 text-red-600 font-medium",
                }}
                modifiers={{
                  completed: (date) => getEntryStatus(date) === "completed",
                  missed: (date) => getEntryStatus(date) === "missed",
                  today: (date) => isSameDay(date, today),
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-darkb text-center md:text-left">
            Weekly Entries
          </h3>
          <WeekAccordion
            weeks={pageState.weeks}
            expandedWeek={pageState.expandedWeeks}
            setExpandedWeek={(weeks) =>
              setPageState((prev) => ({ ...prev, expandedWeeks: weeks }))
            }
            currentDate={today}
          />
        </div>
      </div>
    </div>
  );
}
