// utils/date.js

// Helper to ensure consistent timezone handling
function createSafeDate(dateInput) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

  // Ensure we're working with a fresh date object
  const safeDate = new Date(date);

  // Set to noon to avoid any daylight savings issues
  safeDate.setHours(12, 0, 0, 0);

  return safeDate;
}

export function getLocalDate(dateInput) {
  const date = createSafeDate(dateInput);
  return date;
}

export function formatDateForUrl(dateInput) {
  const date = createSafeDate(dateInput);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateForDisplay(dateInput) {
  const date = createSafeDate(dateInput);
  return date.toISOString().split("T")[0];
}

export function formatFullDate(dateStr) {
  const date = createSafeDate(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Helper to compare dates (ignoring time)
export function isSameDay(date1, date2) {
  const d1 = createSafeDate(date1);
  const d2 = createSafeDate(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
