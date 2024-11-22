export function formatForDisplay(date, format = "full") {
  const d = createSafeDate(date);

  const formats = {
    full: {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
    short: {
      month: "short",
      day: "numeric",
    },
  };

  return d.toLocaleDateString("en-US", formats[format]);
}
