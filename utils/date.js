// utils/date.js

export function createSafeDate(dateInput) {
  try {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    // Set to noon to avoid timezone issues
    date.setHours(12, 0, 0, 0);
    return date;
  } catch (error) {
    console.error("Error in createSafeDate:", error);
    const now = new Date();
    now.setHours(12, 0, 0, 0);
    return now;
  }
}

export function getLocalDate(date) {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  return d;
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

export function isSameDay(date1, date2) {
  if (!date1 || !date2) return false;
  const d1 = createSafeDate(date1);
  const d2 = createSafeDate(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function getTodayFromUI() {
  try {
    // Only run querySelector in browser environment
    if (typeof document !== "undefined") {
      // Look specifically for the Add Journal Entry button
      const journalButton = document.querySelector("button, a");
      const buttonText = journalButton?.textContent || "";
      const dateMatch = buttonText.match(/\((\d{4}-\d{2}-\d{2})\)/);

      if (dateMatch) {
        const dateFromButton = new Date(dateMatch[1]);
        if (!isNaN(dateFromButton.getTime())) {
          return getLocalDate(dateFromButton);
        }
      }
    }
  } catch (error) {
    console.warn("Error getting date from UI:", error);
  }

  // Fallback to current date
  return getLocalDate(new Date());
}
