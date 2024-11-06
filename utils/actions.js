// lib/actions.js
"use server";

import prisma from "@/utils/db";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

// Settings Actions
export async function createUpdateSettings(formData) {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: {
        surgeryDate: formData.surgeryDate,
        knee: formData.knee,
        graftType: formData.graftType,
        weightBearing: formData.weightBearing,
        favoriteSport: formData.favoriteSport,
        about: formData.about,
      },
      create: {
        userId,
        ...formData,
      },
    });

    revalidatePath("/settings");
    return { success: true, data: settings };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Journal Entry Actions
export async function createJournalEntry(formData) {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const entry = await prisma.journalEntry.create({
      data: {
        userId,
        date: formData.date,
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
        morningPlan: formData.timeBlockPlans.morning,
        middayPlan: formData.timeBlockPlans.midDay,
        afternoonPlan: formData.timeBlockPlans.afternoon,
        eveningPlan: formData.timeBlockPlans.evening,
        rehabTasks: {
          create: formData.tasks.map((task, index) => ({
            text: task,
            order: index,
          })),
        },
        wins: {
          create: formData.wins
            .filter((win) => win.trim() !== "")
            .map((win, index) => ({
              win,
              order: index,
            })),
        },
      },
    });

    revalidatePath("/journal");
    return { success: true, data: entry };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getJournalEntry(date) {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const entry = await prisma.journalEntry.findUnique({
      where: {
        userId_date: {
          userId,
          date: new Date(date),
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
    const { userId } = auth();
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
