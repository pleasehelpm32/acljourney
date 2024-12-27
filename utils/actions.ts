"use server";

import prisma from "@/utils/db";
import { revalidatePath } from "next/cache";
import { withAuth } from "@/utils/auth-helper";
import { createSafeDate } from "@/utils/date";
import {
  CreateSettingsInput,
  CreateJournalEntryInput,
  PostOpDuration,
  ActionResponse,
} from "@/types/actions";
import { JournalEntry, WeekEntry, UserSettings } from "@/types/index";

export async function createUpdateSettings(
  formData: CreateSettingsInput
): Promise<ActionResponse<UserSettings>> {
  return withAuth(
    async (userId: string): Promise<ActionResponse<UserSettings>> => {
      if (!formData.surgeryDate) {
        throw new Error("Surgery date is required");
      }

      const settingsData = {
        surgeryDate: createSafeDate(formData.surgeryDate),
        ...(formData.knee && { knee: formData.knee }),
        ...(formData.graftType && { graftType: formData.graftType }),
        ...(formData.weightBearing && {
          weightBearing: formData.weightBearing,
        }),
        ...(formData.favoriteSport?.trim() && {
          favoriteSport: formData.favoriteSport.trim(),
        }),
        ...(formData.about?.trim() && { about: formData.about.trim() }),
      };

      const settings = await prisma.userSettings.upsert({
        where: { userId },
        update: settingsData,
        create: { userId, ...settingsData },
      });

      revalidatePath("/settings");
      return { success: true, data: settings as UserSettings };
    }
  );
}

export async function getSettings(): Promise<
  ActionResponse<UserSettings | null>
> {
  return withAuth(
    async (userId: string): Promise<ActionResponse<UserSettings | null>> => {
      const settings = await prisma.userSettings.findUnique({
        where: { userId },
      });
      return { success: true, data: settings as UserSettings | null };
    }
  );
}

export async function createJournalEntry(
  formData: CreateJournalEntryInput
): Promise<ActionResponse<JournalEntry>> {
  return withAuth(async (userId: string) => {
    const [year, month, day] = formData.date.split("-").map(Number);
    const entryDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));

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
      morningPlan: formData.timeBlockPlans?.morning,
      middayPlan: formData.timeBlockPlans?.midDay,
      afternoonPlan: formData.timeBlockPlans?.afternoon,
      eveningPlan: formData.timeBlockPlans?.evening,
    };

    const entry = await prisma.journalEntry.upsert({
      where: {
        userId_date: { userId, date: entryDate },
      },
      update: {
        ...data,
        rehabTasks: {
          deleteMany: {},
          create:
            formData.tasks?.map((task, index) => ({
              text: task.text || "",
              completed: Boolean(task.completed),
              order: index,
            })) || [],
        },
        wins: {
          deleteMany: {},
          create:
            formData.wins?.map((win, index) => ({
              win: win || "",
              order: index,
            })) || [],
        },
      },
      create: {
        userId,
        date: entryDate,
        ...data,
        rehabTasks: {
          create:
            formData.tasks?.map((task, index) => ({
              text: task.text || "",
              completed: Boolean(task.completed),
              order: index,
            })) || [],
        },
        wins: {
          create:
            formData.wins?.map((win, index) => ({
              win: win || "",
              order: index,
            })) || [],
        },
      },
      include: {
        rehabTasks: true,
        wins: true,
      },
    });

    return { success: true, data: entry };
  });
}

export async function getJournalEntry(
  date: string
): Promise<ActionResponse<JournalEntry | null>> {
  return withAuth(async (userId: string) => {
    const entryDate = createSafeDate(date);

    const entry = await prisma.journalEntry.findUnique({
      where: {
        userId_date: { userId, date: entryDate },
      },
      include: {
        rehabTasks: {
          orderBy: { order: "asc" },
        },
        wins: {
          orderBy: { order: "asc" },
        },
      },
    });

    return { success: true, data: entry };
  });
}

export async function getJournalWeeks(): Promise<ActionResponse<WeekEntry[]>> {
  return withAuth(async (userId: string) => {
    const [userSettings, entries] = await Promise.all([
      prisma.userSettings.findUnique({ where: { userId } }),
      prisma.journalEntry.findMany({
        where: { userId },
        orderBy: { date: "desc" },
      }),
    ]);

    const today = createSafeDate(new Date());
    const startDate = userSettings?.surgeryDate
      ? createSafeDate(userSettings.surgeryDate)
      : entries.length > 0
      ? createSafeDate(entries[entries.length - 1].date)
      : today;

    const completedEntries = new Map(
      entries.map((entry) => [
        new Date(entry.date).toISOString().split("T")[0],
        true,
      ])
    );

    const weekEntries: Record<string, WeekEntry> = {};
    let currentDate = new Date(startDate);

    while (currentDate <= today) {
      const weekStart = new Date(currentDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(12, 0, 0, 0);

      const weekKey = weekStart.toISOString().split("T")[0];

      if (!weekEntries[weekKey]) {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        weekEntries[weekKey] = {
          id: weekKey,
          number:
            Math.ceil(
              (weekStart.getTime() - startDate.getTime()) /
                (7 * 24 * 60 * 60 * 1000)
            ) + 1,
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

        for (let i = 0; i < 7; i++) {
          const date = new Date(weekStart);
          date.setDate(date.getDate() + i);
          const dateStr = date.toISOString().split("T")[0];
          const todayStr = today.toISOString().split("T")[0];

          weekEntries[weekKey].entries[i] =
            dateStr > todayStr
              ? "future"
              : date < startDate
              ? "disabled"
              : completedEntries.has(dateStr)
              ? "completed"
              : dateStr === todayStr
              ? "future"
              : date < today
              ? "missed"
              : "future";
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      success: true,
      data: Object.values(weekEntries).sort((a, b) => b.number - a.number),
    };
  });
}

export async function calculateStreak(): Promise<ActionResponse<number>> {
  return withAuth(async (userId: string) => {
    const [userSettings, entries] = await Promise.all([
      prisma.userSettings.findUnique({
        where: { userId },
        select: { surgeryDate: true },
      }),
      prisma.journalEntry.findMany({
        where: { userId },
        orderBy: { date: "desc" },
      }),
    ]);

    if (!userSettings?.surgeryDate || !entries.length) {
      return { success: true, data: 0 };
    }

    const today = createSafeDate(new Date());
    const todayStr = today.toISOString().split("T")[0];

    const entryDates = new Map(
      entries.map((entry) => [
        createSafeDate(entry.date).toISOString().split("T")[0],
        true,
      ])
    );

    let streak = 0;
    let checkDate = new Date(today);
    const surgeryDate = createSafeDate(userSettings.surgeryDate);

    // If it's today, start checking from yesterday
    if (entryDates.has(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (checkDate >= surgeryDate) {
      const dateStr = checkDate.toISOString().split("T")[0];
      if (!entryDates.has(dateStr)) {
        break;
      }
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Add today's entry to streak if it exists
    if (entryDates.has(todayStr)) {
      streak++;
    }

    return { success: true, data: streak };
  });
}

export async function getPostOpDuration(
  targetDate: string | null = null
): Promise<ActionResponse<PostOpDuration>> {
  return withAuth(async (userId: string) => {
    const settings = await prisma.userSettings.findUnique({
      where: { userId },
      select: { surgeryDate: true },
    });

    if (!settings?.surgeryDate) {
      throw new Error("Surgery date not set");
    }

    const surgery = createSafeDate(settings.surgeryDate);
    const compareDate = createSafeDate(targetDate || new Date());

    const diffTime = Math.abs(compareDate.getTime() - surgery.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    const remainingDays = diffDays % 7;

    return {
      success: true,
      data: {
        weeks,
        days: remainingDays,
        text: `${weeks} ${weeks === 1 ? "week" : "weeks"}${
          remainingDays > 0
            ? ` and ${remainingDays} ${remainingDays === 1 ? "day" : "days"}`
            : ""
        } post-surgery`,
      },
    };
  });
}
