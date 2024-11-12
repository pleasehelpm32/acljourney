import { CheckCircle, XCircle, Circle, MinusCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function WeekBar({ entries, startDate }) {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getStatusClasses = (status, isToday) => {
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
          isToday
            ? "bg-blue-50 text-blue-500 hover:bg-blue-100 hover:scale-110 cursor-pointer shadow-sm hover:shadow-md ring-1 ring-blue-100 hover:ring-blue-200"
            : "bg-gray-50 text-gray-400 ring-1 ring-gray-200"
        );
    }
  };

  const getStatusIcon = (status, isToday) => {
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
        return isToday ? (
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

  const formatDateForUrl = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  // Get today's date at midnight UTC
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split("T")[0];

  return (
    <div className="flex justify-between gap-2 my-6 px-2">
      {daysOfWeek.map((day, index) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + index);
        date.setHours(0, 0, 0, 0);

        const dateStr = date.toISOString().split("T")[0];
        const isToday = dateStr === todayStr;

        // Determine the final status
        let status = entries?.[index];
        if (date < today && status !== "completed" && status !== "disabled") {
          status = "missed";
        }

        const isClickable =
          status === "completed" || status === "missed" || isToday;

        const dayContent = (
          <div className="flex flex-col items-center gap-2">
            <span
              className={cn(
                "text-sm font-medium",
                isToday ? "text-blue-600" : "text-gray-600"
              )}
            >
              {day}
            </span>
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                getStatusClasses(status, isToday)
              )}
            >
              {getStatusIcon(status, isToday)}
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
