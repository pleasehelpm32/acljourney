// lib/actions.js
"use server";

import prisma from "@/utils/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  getLocalDate,
  formatDateForUrl,
  formatDateForDisplay,
  formatFullDate,
} from "@/utils/date";

function createSafeDate(dateInput) {
  try {
    const localDate = getLocalDate(
      dateInput instanceof Date ? dateInput : new Date(dateInput)
    );
    localDate.setHours(12, 0, 0, 0);
    return localDate;
  } catch (error) {
    console.error("Error in createSafeDate:", error);
    return getLocalDate(new Date());
  }
}

export async function createUpdateSettings(formData) {
  try {
    const session = await auth();
    console.log("Auth session:", session);

    const { userId } = session;
    if (!userId) throw new Error("Unauthorized");

    // Only validate surgery date
    if (!formData.surgeryDate) {
      throw new Error("Surgery date is required");
    }

    // Create settings object with only defined values
    const settingsData = {
      surgeryDate: new Date(formData.surgeryDate),
      ...(formData.knee && { knee: formData.knee }),
      ...(formData.graftType && { graftType: formData.graftType }),
      ...(formData.weightBearing && { weightBearing: formData.weightBearing }),
      ...(formData.favoriteSport?.trim() && {
        favoriteSport: formData.favoriteSport.trim(),
      }),
      ...(formData.about?.trim() && { about: formData.about.trim() }),
    };

    console.log("Settings data to save:", settingsData);

    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: settingsData,
      create: {
        userId,
        ...settingsData,
      },
    });

    console.log("Settings saved:", settings);
    revalidatePath("/settings");
    return { success: true, data: settings };
  } catch (error) {
    console.error("Settings error:", error);
    return { success: false, error: error.message };
  }
}

//Get existing settings from db
export async function getSettings() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    return { success: true, data: settings };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function createJournalEntry(formData) {
  console.log("Starting createJournalEntry with formData:", formData);

  // Early validation
  if (!formData || typeof formData !== "object") {
    console.error("Invalid form data received:", formData);
    return { success: false, error: "Invalid form data" };
  }

  try {
    const session = await auth();

    if (!session?.userId) {
      console.error("No user ID found in session");
      return { success: false, error: "Authentication required" };
    }

    const userId = session.userId;
    const entryDate = getLocalDate(formData.date);
    entryDate.setHours(0, 0, 0, 0);

    // Prepare the data object
    const data = {
      emotion: formData.selectedEmotion,
      energyLevel: formData.energyLevel,
      painLevel: formData.painLevel,
      swelling: formData.swelling,
      kneeFlexion: formData.kneeFlexion,
      kneeExtension: formData.kneeExtension,
      dailyFocus: formData.focus,
      selfCare: formData.selfCare,
      biggestChallenge: formData.biggestChallenge,
      lessonLearned: formData.lessonLearned,
      improvement: formData.improvement,
      brainDump: formData.brainDump,
      morningPlan: formData.timeBlockPlans?.morning ?? null,
      middayPlan: formData.timeBlockPlans?.midDay ?? null,
      afternoonPlan: formData.timeBlockPlans?.afternoon ?? null,
      eveningPlan: formData.timeBlockPlans?.evening ?? null,
    };

    console.log("Prepared data for upsert:", { userId, entryDate, data });

    const entry = await prisma.journalEntry.upsert({
      where: {
        userId_date: {
          userId,
          date: entryDate,
        },
      },
      update: {
        ...data,
        rehabTasks: {
          deleteMany: {},
          create: Array.isArray(formData.tasks)
            ? formData.tasks.map((task, index) => ({
                text: task.text || "",
                completed: Boolean(task.completed),
                order: index,
              }))
            : [],
        },
        wins: {
          deleteMany: {},
          create: Array.isArray(formData.wins)
            ? formData.wins.map((win, index) => ({
                win: win || "",
                order: index,
              }))
            : [],
        },
      },
      create: {
        userId,
        date: entryDate,
        ...data,
        rehabTasks: {
          create: Array.isArray(formData.tasks)
            ? formData.tasks.map((task, index) => ({
                text: task.text || "",
                completed: Boolean(task.completed),
                order: index,
              }))
            : [],
        },
        wins: {
          create: Array.isArray(formData.wins)
            ? formData.wins.map((win, index) => ({
                win: win || "",
                order: index,
              }))
            : [],
        },
      },
    });

    await revalidatePath("/journal");
    return { success: true, data: entry };
  } catch (error) {
    console.error("Error in createJournalEntry:", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    });

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to save journal entry",
    };
  }
}
export async function getJournalEntry(date) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Use the timezone-safe date creation
    const entryDate = createSafeDate(date);

    const entry = await prisma.journalEntry.findUnique({
      where: {
        userId_date: {
          userId,
          date: entryDate,
        },
      },
      include: {
        rehabTasks: {
          orderBy: {
            order: "asc",
          },
        },
        wins: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return { success: true, data: entry };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getJournalEntries(startDate, endDate) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const start = createSafeDate(startDate);
    const end = createSafeDate(endDate);

    const entries = await prisma.journalEntry.findMany({
      where: {
        userId,
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        rehabTasks: true,
        wins: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return { success: true, data: entries };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
export async function getJournalWeeks() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // First, get the user's surgery date
    const userSettings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    // Get all entries
    const entries = await prisma.journalEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    // Get current date in UTC, then convert to local time
    const today = new Date();
    // Force timezone to match user's timezone
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    today.setHours(0, 0, 0, 0);

    // Calculate start date from surgery date
    const startDate = userSettings?.surgeryDate
      ? new Date(userSettings.surgeryDate)
      : entries.length > 0
      ? new Date(entries[entries.length - 1].date)
      : today;

    startDate.setHours(0, 0, 0, 0);

    // Create a map of completed entries by date string
    const completedEntries = new Map(
      entries.map((entry) => {
        const d = new Date(entry.date);
        d.setHours(0, 0, 0, 0);
        return [d.toISOString().split("T")[0], true];
      })
    );

    // Group entries by week
    const weekEntries = {};
    let currentDate = new Date(startDate);

    while (currentDate <= today) {
      const weekStart = new Date(currentDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const weekKey = weekStart.toISOString().split("T")[0];

      if (!weekEntries[weekKey]) {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        weekEntries[weekKey] = {
          id: weekKey,
          number:
            Math.ceil((weekStart - startDate) / (7 * 24 * 60 * 60 * 1000)) + 1,
          dateRange: `${weekStart.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })} - ${weekEnd.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}`,
          startDate: weekStart,
          endDate: weekEnd,
          entries: Array(7).fill("future"),
        };

        // Fill in entries for this week
        for (let i = 0; i < 7; i++) {
          const date = new Date(weekStart);
          date.setDate(date.getDate() + i);
          date.setHours(0, 0, 0, 0);
          const dateStr = date.toISOString().split("T")[0];
          const todayStr = today.toISOString().split("T")[0];

          if (dateStr > todayStr) {
            weekEntries[weekKey].entries[i] = "future";
          } else if (date < startDate) {
            weekEntries[weekKey].entries[i] = "disabled";
          } else if (completedEntries.has(dateStr)) {
            weekEntries[weekKey].entries[i] = "completed";
          } else if (dateStr === todayStr) {
            weekEntries[weekKey].entries[i] = "future";
          } else if (date < today) {
            weekEntries[weekKey].entries[i] = "missed";
          } else {
            weekEntries[weekKey].entries[i] = "future";
          }
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      success: true,
      data: Object.values(weekEntries).sort((a, b) => b.number - a.number),
    };
  } catch (error) {
    console.error("Error in getJournalWeeks:", error);
    return { success: false, error: error.message };
  }
}

export async function calculateStreak() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Get user's surgery date and settings
    const userSettings = await prisma.userSettings.findUnique({
      where: { userId },
      select: { surgeryDate: true },
    });

    // If no settings or surgery date, return 0 streak
    if (!userSettings?.surgeryDate) {
      return { success: true, data: 0 };
    }

    // Get journal entries
    const entries = await prisma.journalEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" }, // Most recent first
    });

    // If no entries, return 0 streak
    if (!entries || entries.length === 0) {
      return { success: true, data: 0 };
    }

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Convert entries to a Set of date strings for easy lookup
    const entryDates = new Set(
      entries.map((entry) => {
        const d = new Date(entry.date);
        d.setHours(0, 0, 0, 0);
        return d.toISOString().split("T")[0];
      })
    );

    // Start checking from today and go backwards
    let checkDate = new Date(today);
    checkDate.setHours(0, 0, 0, 0);

    while (true) {
      const dateStr = checkDate.toISOString().split("T")[0];

      // Stop if we hit a day without an entry
      if (!entryDates.has(dateStr)) {
        break;
      }

      // Stop if we've gone past the surgery date
      const surgeryDate = new Date(userSettings.surgeryDate);
      surgeryDate.setHours(0, 0, 0, 0);
      if (checkDate < surgeryDate) {
        break;
      }

      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return { success: true, data: streak };
  } catch (error) {
    console.error("Error calculating streak:", error);
    return { success: true, data: 0 }; // Return 0 instead of error for better UX
  }
}
// utils/actions.js
export async function getSurgeryDate() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const settings = await prisma.userSettings.findUnique({
      where: { userId },
      select: { surgeryDate: true },
    });

    return { success: true, data: settings?.surgeryDate || null };
  } catch (error) {
    console.error("Error getting surgery date:", error);
    return { success: false, error: error.message };
  }
}
