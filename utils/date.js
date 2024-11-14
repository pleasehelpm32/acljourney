// utils/date.js
export function getLocalDate(date) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d;
}

export function formatDateForUrl(date) {
  const d = getLocalDate(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateForDisplay(date) {
  const d = getLocalDate(date);
  return d.toISOString().split("T")[0];
}

export function formatFullDate(dateStr) {
  const d = getLocalDate(new Date(dateStr));
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
