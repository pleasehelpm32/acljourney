// components/SurgeryDate.jsx
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
import { Label } from "@/components/ui/label";

export default function SurgeryDate({ value, onChange }) {
  return (
    <div className="space-y-3">
      <Label
        htmlFor="surgeryDate"
        className="text-sm font-medium text-gray-700"
      >
        Surgery Date
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="surgeryDate"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : "Select your surgery date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            disabled={(date) =>
              date > new Date() || date < new Date("2000-01-01")
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
