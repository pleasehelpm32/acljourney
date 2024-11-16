// components/journal/WeekBar.js
import { CheckCircle, XCircle, Circle, MinusCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  getLocalDate,
  formatDateForUrl,
  formatDateForDisplay,
} from "@/utils/date";

export default function WeekBar({ entries, startDate, currentDate }) {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Debug the raw startDate
  console.log("=== Start Date Debug ===");
  console.log("Raw startDate prop:", startDate);
  console.log("Raw startDate as Date:", new Date(startDate));
  console.log("Raw startDate day of week:", new Date(startDate).getDay());
  console.log(
    "Raw startDate day name:",
    daysOfWeek[new Date(startDate).getDay()]
  );

  const weekStartDate = new Date(startDate);
  console.log("weekStartDate after creation:", weekStartDate.toString());
  console.log("weekStartDate day of week:", weekStartDate.getDay());
  console.log("weekStartDate day name:", daysOfWeek[weekStartDate.getDay()]);

  // Debug each date in weekDates array
  const weekDates = daysOfWeek.map((_, index) => {
    const date = new Date(weekStartDate);
    date.setDate(weekStartDate.getDate() + index);

    console.log(`Week date ${index}:`, {
      date: date.toString(),
      dayOfWeek: date.getDay(),
      expectedDayName: daysOfWeek[date.getDay()],
      mappedDayName: daysOfWeek[index],
      doTheyMatch: daysOfWeek[date.getDay()] === daysOfWeek[index],
    });

    return date;
  });

  console.log("=== End Date Debug ===");

  const getStatusClasses = (status) => {
    const baseClasses = "transition-all duration-200 ease-in-out";

    switch (status) {
      case "completed":
        return cn(
          baseClasses,
          "bg-green-50 text-green-600 hover:bg-green-100 hover:scale-110 cursor-pointer shadow-sm hover:shadow-md",
          "ring-1 ring-green-100 hover:ring-green-200"
        );
      case "missed":
        return cn(
          baseClasses,
          "bg-red-50 text-red-500 hover:bg-red-100 hover:scale-110 cursor-pointer shadow-sm hover:shadow-md",
          "ring-1 ring-red-100 hover:ring-red-200"
        );
      case "disabled":
        return cn(
          baseClasses,
          "bg-gray-50 text-gray-300",
          "ring-1 ring-gray-200"
        );
      default:
        return cn(baseClasses, "bg-gray-50 text-gray-400 ring-1 ring-gray-200");
    }
  };

  const getStatusIcon = (status) => {
    const iconProps = {
      className: "h-5 w-5 transition-transform duration-200",
    };

    switch (status) {
      case "completed":
        return (
          <CheckCircle
            {...iconProps}
            className={cn(iconProps.className, "stroke-[1.5]")}
          />
        );
      case "missed":
        return (
          <XCircle
            {...iconProps}
            className={cn(iconProps.className, "stroke-[1.5]")}
          />
        );
      case "disabled":
        return (
          <MinusCircle
            {...iconProps}
            className={cn(iconProps.className, "stroke-[1.5]")}
          />
        );
      default:
        return (
          <Circle
            {...iconProps}
            className={cn(iconProps.className, "stroke-[1.5]")}
          />
        );
    }
  };

  return (
    <div className="flex justify-between gap-2 my-6 px-2">
      {daysOfWeek.map((day, index) => {
        const status = entries?.[index];
        const isClickable = status === "completed" || status === "missed";
        const currentDateForDay = weekDates[index];

        // Enhanced day-specific debug
        console.log(`Rendering day ${index}:`, {
          expectedDay: day,
          actualDate: currentDateForDay.toString(),
          actualDayName: daysOfWeek[currentDateForDay.getDay()],
          match: day === daysOfWeek[currentDateForDay.getDay()],
          formattedDate: formatDateForUrl(currentDateForDay),
          status,
        });

        const dayContent = (
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium text-gray-600">{day}</span>
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                getStatusClasses(status)
              )}
            >
              {getStatusIcon(status)}
            </div>
          </div>
        );

        return (
          <div
            key={day}
            className={cn("relative group", isClickable && "hover:z-10")}
          >
            {isClickable ? (
              <Link href={`/journal/${formatDateForUrl(currentDateForDay)}`}>
                {dayContent}
              </Link>
            ) : (
              dayContent
            )}
          </div>
        );
      })}
    </div>
  );
}
