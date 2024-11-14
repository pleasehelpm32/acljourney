// components/journal/WeekBar.js
import { CheckCircle, XCircle, Circle, MinusCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  getLocalDate,
  formatDateForUrl,
  formatDateForDisplay,
  isSameDay,
} from "@/utils/date";

export default function WeekBar({ entries, startDate, currentDate }) {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getStatusClasses = (status, isActive) => {
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
        return cn(
          baseClasses,
          isActive
            ? "bg-blue-50 text-blue-500 hover:bg-blue-100 hover:scale-110 cursor-pointer shadow-sm hover:shadow-md ring-1 ring-blue-100 hover:ring-blue-200"
            : "bg-gray-50 text-gray-400 ring-1 ring-gray-200"
        );
    }
  };

  const getStatusIcon = (status, isActive) => {
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
        return isActive ? (
          <Circle
            {...iconProps}
            className={cn(iconProps.className, "stroke-[1.5] animate-pulse")}
          />
        ) : (
          <Circle
            {...iconProps}
            className={cn(iconProps.className, "stroke-[1.5]")}
          />
        );
    }
  };

  // Normalize start date
  const startDateLocal = getLocalDate(startDate);

  return (
    <div className="flex justify-between gap-2 my-6 px-2">
      {daysOfWeek.map((day, index) => {
        const date = getLocalDate(startDateLocal);
        date.setDate(date.getDate() + index);

        // Use system date to determine active day
        const today = new Date();
        const isActive = isSameDay(date, today);

        const status = entries?.[index];
        const isClickable =
          status === "completed" || status === "missed" || isActive;

        const dayContent = (
          <div className="flex flex-col items-center gap-2">
            <span
              className={cn(
                "text-sm font-medium",
                isActive ? "text-blue-600" : "text-gray-600"
              )}
            >
              {day}
            </span>
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                getStatusClasses(status, isActive)
              )}
            >
              {getStatusIcon(status, isActive)}
            </div>
          </div>
        );

        return (
          <div
            key={day}
            className={cn("relative group", isClickable && "hover:z-10")}
          >
            {isClickable ? (
              <Link href={`/journal/${formatDateForUrl(date)}`}>
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
