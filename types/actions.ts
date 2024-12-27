import { JournalEntry, UserSettings } from "./index";

export interface CreateSettingsInput {
  surgeryDate: Date;
  knee?: string;
  graftType?: string;
  weightBearing?: string;
  favoriteSport?: string;
  about?: string;
}

export interface CreateJournalEntryInput {
  date: string;
  selectedEmotion?: number;
  energyLevel?: number;
  painLevel?: number;
  swelling?: string;
  kneeFlexion?: string;
  kneeExtension?: string;
  focus?: string;
  selfCare?: string;
  biggestChallenge?: string;
  lessonLearned?: string;
  improvement?: string;
  brainDump?: string;
  tasks?: { text: string; completed: boolean }[];
  wins?: string[];
  timeBlockPlans?: {
    morning?: string;
    midDay?: string;
    afternoon?: string;
    evening?: string;
  };
}

export interface PostOpDuration {
  weeks: number;
  days: number;
  text: string;
}

export type ActionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type AuthResponse<T> = ActionResponse<T>;
