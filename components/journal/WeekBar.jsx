import { Check, X } from "lucide-react";

export default function WeekBar({ entries }) {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex justify-between gap-2 my-4">
      {daysOfWeek.map((day, index) => {
        const status = entries?.[index]; // This would come from your data
        return (
          <div key={day} className="flex flex-col items-center gap-1">
            <span className="text-sm text-gray-600">{day}</span>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center
              ${status === "completed" && "bg-green-100 text-green-600"}
              ${status === "missed" && "bg-red-100 text-red-600"}
              ${status === "future" && "bg-gray-100 text-gray-400"}
            `}
            >
              {status === "completed" && <Check className="h-4 w-4" />}
              {status === "missed" && <X className="h-4 w-4" />}
              {status === "future" && <span className="text-sm">-</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
