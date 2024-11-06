"use client";

import { Calendar } from "@/components/ui/calendar";
import StreakCounter from "@/components/journal/StreakCounter";
import WeekAccordion from "@/components/journal/WeekAccordion";
import CalendarDay from "@/components/journal/CalendarDay";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function JournalPage() {
  const [date, setDate] = useState(new Date());
  const [expandedWeek, setExpandedWeek] = useState("current-week");
  const formatDateForUrl = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  // Example data with proper date objects
  const mockWeeks = [
    {
      id: "week-3",
      number: 3,
      dateRange: "Nov 18 - Nov 24",
      startDate: new Date(2024, 10, 18),
      endDate: new Date(2024, 10, 24),
      entries: Array(7).fill("future"),
    },
    {
      id: "current-week",
      number: 2,
      dateRange: "Nov 11 - Nov 17",
      startDate: new Date(2024, 10, 11),
      endDate: new Date(2024, 10, 17),
      entries: [
        "completed",
        "completed",
        "missed",
        "completed",
        "future",
        "future",
        "future",
      ],
    },
    {
      id: "week-1",
      number: 1,
      dateRange: "Nov 4 - Nov 10",
      startDate: new Date(2024, 10, 4),
      endDate: new Date(2024, 10, 10),
      entries: Array(7).fill("completed"),
    },
  ].sort((a, b) => b.number - a.number);

  // Find which week a date belongs to
  const findWeekForDate = (date) => {
    return mockWeeks.find((week) => {
      const clickedDate = new Date(date);
      // Reset time portions for accurate comparison
      clickedDate.setHours(0, 0, 0, 0);
      const startDate = new Date(week.startDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(week.endDate);
      endDate.setHours(0, 0, 0, 0);

      return clickedDate >= startDate && clickedDate <= endDate;
    });
  };

  const handleDateSelect = (newDate) => {
    setDate(newDate);

    const selectedWeek = findWeekForDate(newDate);
    if (selectedWeek) {
      setExpandedWeek(selectedWeek.id);
    }
  };

  const getEntryStatus = (date) => {
    const week = findWeekForDate(date);
    if (!week) return null;

    const dayIndex = new Date(date).getDay();
    return week.entries[dayIndex];
  };
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div className="space-y-4 w-full md:w-auto">
          <StreakCounter streak={3} />
          <Link href={`/journal/${formatDateForUrl(new Date())}`}>
            <Button className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Journal Entry
            </Button>
          </Link>
        </div>
        <div className="w-full md:w-auto">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-md border"
            modifiersClassNames={{
              selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              today: "bg-accent text-accent-foreground",
              completed: "bg-green-100 text-green-600 font-medium",
              missed: "bg-red-100 text-red-600 font-medium",
            }}
            modifiers={{
              completed: (date) => getEntryStatus(date) === "completed",
              missed: (date) => getEntryStatus(date) === "missed",
            }}
          />
        </div>
      </div>

      <WeekAccordion
        weeks={mockWeeks}
        expandedWeek={expandedWeek}
        setExpandedWeek={setExpandedWeek}
      />
    </div>
  );
}
