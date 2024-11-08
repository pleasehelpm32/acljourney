// lib/actions.js
"use server";

import prisma from "@/utils/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Settings Actions

export async function createUpdateSettings(formData) {
  try {
    // Need to await auth() as it returns a Promise
    const session = await auth();

    const { userId } = session;

    if (!userId) throw new Error("Unauthorized");

    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: {
        surgeryDate: new Date(formData.surgeryDate),
        knee: formData.knee,
        graftType: formData.graftType,
        weightBearing: formData.weightBearing,
        favoriteSport: formData.favoriteSport || null,
        about: formData.about || null,
      },
      create: {
        userId,
        surgeryDate: new Date(formData.surgeryDate),
        knee: formData.knee,
        graftType: formData.graftType,
        weightBearing: formData.weightBearing,
        favoriteSport: formData.favoriteSport || null,
        about: formData.about || null,
      },
    });

    revalidatePath("/settings");
    return { success: true, data: settings };
  } catch (error) {
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

// Journal Entry Actions
export async function createJournalEntry(formData) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    console.log("Received form data in action:", formData);

    const sanitizedData = {
      userId,
      date: new Date(formData.date),
      emotion: formData.selectedEmotion ?? null,
      energyLevel: formData.energyLevel ?? null,
      painLevel: formData.painLevel ?? null,
      swelling: formData.swelling || null,
      kneeFlexion: formData.kneeFlexion || null,
      kneeExtension: formData.kneeExtension || null,
      dailyFocus: formData.focus || null,
      selfCare: formData.selfCare || null,
      biggestChallenge: formData.biggestChallenge || null,
      lessonLearned: formData.lessonLearned || null,
      improvement: formData.improvement || null,
      morningPlan: formData.timeBlockPlans?.morning || null,
      middayPlan: formData.timeBlockPlans?.midDay || null,
      afternoonPlan: formData.timeBlockPlans?.afternoon || null,
      eveningPlan: formData.timeBlockPlans?.evening || null,
    };
    const entryDate = new Date(formData.date);
    entryDate.setHours(12, 0, 0, 0);
    console.log("Action date:", entryDate);

    const entry = await prisma.journalEntry.upsert({
      where: {
        userId_date: {
          userId,
          date: entryDate,
        },
      },
      update: {
        ...sanitizedData,
        rehabTasks: {
          deleteMany: {},
          create: formData.tasks.map((task, index) => ({
            text: task.text || "",
            completed: Boolean(task.completed),
            order: index,
            date: entryDate,
          })),
        },
        wins: {
          deleteMany: {},
          create: formData.wins.map((win, index) => ({
            win: win || "",
            order: index,
          })),
        },
      },
      create: {
        ...sanitizedData,
        rehabTasks: {
          create: formData.tasks.map((task, index) => ({
            text: task.text || "",
            completed: Boolean(task.completed),
            order: index,
            date: entryDate,
          })),
        },
        wins: {
          create: formData.wins.map((win, index) => ({
            win: win || "",
            order: index,
          })),
        },
      },
      include: {
        rehabTasks: true,
        wins: true,
      },
    });

    revalidatePath("/journal");
    return { success: true, data: entry };
  } catch (error) {
    console.error("Error in createJournalEntry:", error);
    return { success: false, error: error.message };
  }
}

export async function getJournalEntry(date) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const entryDate = new Date(date);
    entryDate.setHours(12, 0, 0, 0);

    console.log("Fetching entry for date:", entryDate);

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

    const entries = await prisma.journalEntry.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
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

    console.log(
      "Found entries:",
      entries.map((e) => ({
        date: new Date(e.date).toISOString(),
        formattedDate: new Date(e.date).toLocaleDateString(),
      }))
    );

    // Get current date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate start date (either surgery date or first entry date)
    const startDate = userSettings?.surgeryDate
      ? new Date(userSettings.surgeryDate)
      : entries.length > 0
      ? new Date(entries[entries.length - 1].date)
      : today;

    startDate.setHours(0, 0, 0, 0);

    // Create a map of completed entries by date string
    const completedEntries = new Map();
    entries.forEach((entry) => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      const dateStr = entryDate.toISOString().split("T")[0];
      completedEntries.set(dateStr, true);
    });

    console.log("Completed entries map:", Array.from(completedEntries.keys()));

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
          console.log("Checking date:", {
            date: dateStr,
            isCompleted: completedEntries.has(dateStr),
            isFuture: date > today,
            isToday: date.getTime() === today.getTime(),
          });

          if (date > today) {
            weekEntries[weekKey].entries[i] = "future";
          } else if (date < startDate) {
            weekEntries[weekKey].entries[i] = "disabled";
          } else if (completedEntries.has(dateStr)) {
            weekEntries[weekKey].entries[i] = "completed";
          } else if (date.getTime() === today.getTime()) {
            // Special handling for today
            weekEntries[weekKey].entries[i] = completedEntries.has(dateStr)
              ? "completed"
              : "future";
          } else if (date < today) {
            weekEntries[weekKey].entries[i] = "missed";
          } else {
            weekEntries[weekKey].entries[i] = "future";
          }
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    const result = Object.values(weekEntries).sort(
      (a, b) => b.number - a.number
    );
    console.log(
      "Final weeks data:",
      result.map((week) => ({
        dateRange: week.dateRange,
        entries: week.entries,
      }))
    );

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error in getJournalWeeks:", error);
    return { success: false, error: error.message };
  }
}

export async function calculateStreak() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Get user's surgery date and all entries
    const userSettings = await prisma.userSettings.findUnique({
      where: { userId },
      select: { surgeryDate: true },
    });

    const entries = await prisma.journalEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" }, // Most recent first
    });

    if (!entries.length) return { success: true, data: 0 };

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

    // Start checking from the most recent entry
    let checkDate = new Date(entries[0].date);
    checkDate.setHours(0, 0, 0, 0);

    // If the most recent entry is from today or yesterday, start counting
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (checkDate <= today) {
      while (true) {
        const dateStr = checkDate.toISOString().split("T")[0];

        // Stop if we hit a day without an entry
        if (!entryDates.has(dateStr)) {
          break;
        }

        // Stop if we've gone past the surgery date
        if (userSettings?.surgeryDate) {
          const surgeryDate = new Date(userSettings.surgeryDate);
          surgeryDate.setHours(0, 0, 0, 0);
          if (checkDate < surgeryDate) {
            break;
          }
        }

        streak++;

        // Move to previous day
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }

    console.log("Calculated streak:", {
      streak,
      mostRecentEntry: entries[0].date,
      today: today.toISOString(),
    });

    return { success: true, data: streak };
  } catch (error) {
    console.error("Error calculating streak:", error);
    return { success: false, error: error.message };
  }
}
