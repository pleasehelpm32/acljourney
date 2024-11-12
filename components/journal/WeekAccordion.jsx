// WeekAccordion.jsx
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import WeekBar from "./WeekBar";

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
        // Directly set the new array of values
        setExpandedWeek(values);
      }}
    >
      {weeks.map((week) => (
        <AccordionItem key={week.id} value={week.id}>
          <AccordionTrigger className="text-left">
            Week {week.number} Post-Op ({week.dateRange})
          </AccordionTrigger>
          <AccordionContent>
            <WeekBar entries={week.entries} startDate={week.startDate} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
