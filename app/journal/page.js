//journal/page.js
"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import StreakCounter from "@/components/journal/StreakCounter";
import WeekAccordion from "@/components/journal/WeekAccordion";
import { Button } from "@/components/ui/button";
import { Plus, Save } from "lucide-react";
import Link from "next/link";
import { getJournalWeeks } from "@/utils/actions";
import { useToast } from "@/hooks/use-toast";
import {
  getLocalDate,
  formatDateForUrl,
  formatDateForDisplay,
  formatFullDate,
  isSameDay,
  getTodayFromUI,
} from "@/utils/date";

export default function JournalPage() {
  const [date, setDate] = useState(getTodayFromUI());
  const [expandedWeeks, setExpandedWeeks] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const today = getTodayFromUI();
  const formattedToday = formatDateForUrl(today);

  useEffect(() => {
    async function loadJournalWeeks() {
      try {
        setIsLoading(true);
        const result = await getJournalWeeks();
        console.log("API Response:", result);

        if (result.success) {
          setWeeks(result.data || []);
          // Only set initial expanded week if no weeks are expanded
          if (expandedWeeks.length === 0 && result.data?.length > 0) {
            setExpandedWeeks([result.data[0].id]); // Initialize with an array
          }
        } else {
          console.error("Failed to load weeks:", result.error);
          toast({
            title: "Error",
            description: result.error || "Failed to load journal entries",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Component error:", error);
        toast({
          title: "Error",
          description: "Unable to load journal entries. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadJournalWeeks();
  }, [toast]);

  const findWeekForDate = (date) => {
    return weeks.find((week) => {
      const clickedDate = getLocalDate(date);
      clickedDate.setHours(0, 0, 0, 0);
      const startDate = getLocalDate(week.startDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = getLocalDate(week.endDate);
      endDate.setHours(0, 0, 0, 0);

      return clickedDate >= startDate && clickedDate <= endDate;
    });
  };

  const handleDateSelect = (newDate) => {
    setDate(newDate);
    const selectedWeek = findWeekForDate(newDate);
    if (selectedWeek) {
      // Add the selected week's id to expanded weeks if it's not already there
      setExpandedWeeks((prev) =>
        prev.includes(selectedWeek.id) ? prev : [...prev, selectedWeek.id]
      );
    }
  };

  const getEntryStatus = (date) => {
    const week = findWeekForDate(date);
    if (!week) return null;

    const localDate = getLocalDate(date);
    const dayIndex = localDate.getDay();
    return week.entries[dayIndex];
  };

  if (isLoading) {
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
      {/* Main container with better mobile padding */}
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-3xl">
        {/* SEO Heading */}
        <h1 className="sr-only">ACL Journey - Recovery Journal</h1>

        {/* Top Section with Streak and Add Entry */}
        <div className="flex flex-col space-y-6 mb-8">
          {/* Title Section */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-darkb mb-2">
              Recovery Journal
            </h2>
            <p className="text-silver_c text-sm md:text-base">
              Track your daily progress and milestones
            </p>
          </div>

          {/* Streak and Calendar Section */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Left Column - Streak & Add Entry */}
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

            {/* Right Column - Calendar */}
            <div className="w-full lg:w-auto">
              <Calendar
                mode="single"
                selected={date}
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

        {/* Weekly Entries Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-darkb text-center md:text-left">
            Weekly Entries
          </h3>
          <WeekAccordion
            weeks={weeks}
            expandedWeek={expandedWeeks}
            setExpandedWeek={setExpandedWeeks}
            currentDate={today}
          />
        </div>
      </div>
    </div>
  );
}
