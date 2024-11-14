//components/journal/WeekAccordion
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import WeekBar from "./WeekBar";
import { getLocalDate, formatDateForUrl } from "@/utils/date";

export default function WeekAccordion({
  weeks,
  expandedWeek,
  setExpandedWeek,
}) {
  return (
    <Accordion
      type="multiple"
      value={expandedWeek}
      onValueChange={(values) => {
        setExpandedWeek(values);
      }}
    >
      {weeks.map((week) => {
        // Convert dates to local time
        const startDate = getLocalDate(week.startDate);

        return (
          <AccordionItem key={week.id} value={week.id}>
            <AccordionTrigger className="text-left">
              Week {week.number} Post-Op ({week.dateRange})
            </AccordionTrigger>
            <AccordionContent>
              <WeekBar entries={week.entries} startDate={startDate} />
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
