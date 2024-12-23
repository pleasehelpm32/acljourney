export function createSafeDate(dateInput: string | number | Date): Date {
  try {
    const date = new Date(dateInput);
    // Use UTC methods to avoid timezone issues
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0)
    );
  } catch (error) {
    console.error("Error in createSafeDate:", error);
    const now = new Date();
    return new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0)
    );
  }
}

export function formatDateForUrl(dateInput: string | number | Date): string {
  const date = createSafeDate(dateInput);
  return date.toISOString().split("T")[0];
}

export { formatDateForUrl as formatDateForDisplay };

export function formatFullDate(dateStr: string | number | Date): string {
  const date = createSafeDate(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function isSameDay(
  date1: Date | null | undefined,
  date2: Date | null | undefined
): boolean {
  if (!date1 || !date2) return false;
  const d1 = createSafeDate(date1);
  const d2 = createSafeDate(date2);
  return d1.toISOString().split("T")[0] === d2.toISOString().split("T")[0];
}

export function getToday(): Date {
  return createSafeDate(new Date());
}
