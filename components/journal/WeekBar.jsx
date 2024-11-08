import { Check, X } from "lucide-react";
// components/journal/WeekBar.jsx
export default function WeekBar({ entries }) {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getStatusClasses = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-600";
      case "missed":
        return "bg-red-100 text-red-600";
      case "disabled":
        return "bg-gray-50 text-gray-300";
      default:
        return "bg-gray-100 text-gray-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <Check className="h-4 w-4" />;
      case "missed":
        return <X className="h-4 w-4" />;
      case "disabled":
        return <span className="text-sm">-</span>;
      default:
        return <span className="text-sm">-</span>;
    }
  };

  return (
    <div className="flex justify-between gap-2 my-4">
      {daysOfWeek.map((day, index) => {
        const status = entries?.[index];
        return (
          <div key={day} className="flex flex-col items-center gap-1">
            <span className="text-sm text-gray-600">{day}</span>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusClasses(
                status
              )}`}
            >
              {getStatusIcon(status)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
