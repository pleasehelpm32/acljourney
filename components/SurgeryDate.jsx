"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function SurgeryDate() {
  const [date, setDate] = React.useState();

  return (
    <div className="flex flex-row items-center gap-4 max-w-sm">
      <label
        htmlFor="surgeryDate"
        className="text-sm font-medium text-gray-700"
      >
        Surgery Date
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="surgeryDate"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : "Select your surgery date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            disabled={(date) =>
              date > new Date() || date < new Date("2000-01-01")
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
