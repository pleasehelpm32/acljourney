// components/journal/WeekAccordion.js
export default function WeekAccordion({
  weeks,
  expandedWeek,
  setExpandedWeek,
  currentDate,
}) {
  return (
    <Accordion
      type="multiple"
      value={expandedWeek}
      onValueChange={setExpandedWeek}
    >
      {weeks.map((week) => {
        const startDate = getLocalDate(week.startDate);

        return (
          <AccordionItem key={week.id} value={week.id}>
            <AccordionTrigger className="text-left">
              Week {week.number} Post-Op ({week.dateRange})
            </AccordionTrigger>
            <AccordionContent>
              <WeekBar
                entries={week.entries}
                startDate={startDate}
                currentDate={currentDate}
              />
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
