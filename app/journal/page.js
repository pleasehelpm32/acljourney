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

export default function JournalPage() {
  const [date, setDate] = useState(new Date());
  const [expandedWeeks, setExpandedWeeks] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const formatDateForUrl = (date) => {
    const d = new Date(date);
    d.setHours(12, 0, 0, 0); // Set to noon

    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();

    const formatted = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    console.log("Formatting URL date:", { original: date, formatted });
    return formatted;
  };

  // Then in your JSX
  const today = new Date();

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
            setExpandedWeeks([result.data[0].id]); // Set as array with first week's id
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
  }, [toast]); // Remove expandedWeeks from dependency array

  const findWeekForDate = (date) => {
    return weeks.find((week) => {
      const clickedDate = new Date(date);
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
      setExpandedWeeks([selectedWeek.id]); // Set as array with selected week's id
    }
  };

  const getEntryStatus = (date) => {
    const week = findWeekForDate(date);
    if (!week) return null;

    const dayIndex = new Date(date).getDay();
    return week.entries[dayIndex];
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-3xl flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Save className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading journal entries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div className="space-y-4 w-full md:w-auto">
          <StreakCounter />
          <Link
            href={`/journal/${formattedToday}`}
            className="w-full md:w-auto"
          >
            <Button className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Journal Entry ({formattedToday})
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
        weeks={weeks}
        expandedWeek={expandedWeeks} // This is now always an array
        setExpandedWeek={(value) => {
          setExpandedWeeks((prev) =>
            prev.includes(value)
              ? prev.filter((v) => v !== value)
              : [...prev, value]
          );
        }}
      />
    </div>
  );
}
