"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import WeekBar from "./WeekBar";
import Link from "next/link";

export default function WeekAccordion({
  weeks,
  expandedWeek,
  setExpandedWeek,
}) {
  const formatDateForUrl = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const formatDisplayDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Accordion
      type="multiple"
      value={expandedWeek}
      onValueChange={setExpandedWeek}
    >
      {weeks.map((week) => {
        // Create an array of dates for this week
        const weekDates = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(week.startDate);
          date.setDate(date.getDate() + i);
          return date;
        });

        return (
          <AccordionItem key={week.id} value={week.id}>
            <AccordionTrigger className="text-left">
              Week {week.number} Post-Op ({week.dateRange})
            </AccordionTrigger>
            <AccordionContent>
              <WeekBar entries={week.entries} />
              <div className="space-y-4">
                {weekDates.map((date, index) => {
                  const entry = week.entries[index];
                  const entryDate = new Date(date);
                  entryDate.setHours(0, 0, 0, 0);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  // Show link if entry is completed OR if it's today
                  if (
                    entry === "completed" ||
                    entryDate.getTime() === today.getTime()
                  ) {
                    const dateStr = formatDateForUrl(entryDate);
                    console.log("Creating entry link for:", dateStr, entry);
                    return (
                      <Link
                        key={dateStr}
                        href={`/journal/${dateStr}`}
                        className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Entry for {formatDisplayDate(entryDate)}
                      </Link>
                    );
                  }
                  return null;
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
