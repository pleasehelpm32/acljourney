"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import WeekBar from "./WeekBar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function WeekAccordion({
  weeks,
  expandedWeek,
  setExpandedWeek,
}) {
  const formatDateForUrl = (date) => {
    return new Date(date).toISOString().split("T")[0]; // Returns "YYYY-MM-DD"
  };

  return (
    <Accordion
      type="single"
      collapsible
      value={expandedWeek}
      onValueChange={setExpandedWeek}
    >
      {weeks.map((week) => (
        <AccordionItem key={week.id} value={week.id}>
          <AccordionTrigger className="text-left">
            Week {week.number} Post-Op ({week.dateRange})
          </AccordionTrigger>
          <AccordionContent>
            <WeekBar entries={week.entries} />
            <div className="space-y-4">
              {week.entries.map((entry, index) => {
                if (entry && entry !== "future") {
                  const entryDate = new Date(week.startDate);
                  entryDate.setDate(entryDate.getDate() + index);
                  const dateStr = formatDateForUrl(entryDate);

                  return (
                    <Link
                      key={index}
                      href={`/journal/${dateStr}`}
                      className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Entry for {entryDate.toLocaleDateString()}
                    </Link>
                  );
                }
                return null;
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
