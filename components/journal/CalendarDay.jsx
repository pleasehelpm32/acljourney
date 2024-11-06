// components/journal/CalendarDay.jsx
export default function CalendarDay({ day, status }) {
  return (
    <div
      className={`h-8 w-8 flex items-center justify-center rounded-full
        ${status === "completed" && "bg-green-100 text-green-600 font-medium"}
        ${status === "missed" && "bg-red-100 text-red-600 font-medium"}
      `}
    >
      {day}
    </div>
  );
}
