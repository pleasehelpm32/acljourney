import { createSafeDate } from "./date";

type FormatType = "full" | "short";

interface FormatOptions {
  weekday?: "long" | "short" | "narrow";
  year?: "numeric" | "2-digit";
  month?: "long" | "short" | "narrow" | "numeric" | "2-digit";
  day?: "numeric" | "2-digit";
}

const formatConfigs: Record<FormatType, FormatOptions> = {
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

export function formatForDisplay(
  date: Date | string,
  format: FormatType = "full"
): string {
  const d = createSafeDate(date);
  return d.toLocaleDateString("en-US", formatConfigs[format]);
}
