// User Settings Types
export interface UserSettings {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  surgeryDate: Date;
  knee?: "left" | "right" | null;
  graftType?: string | null;
  weightBearing?: "weight-bearing" | "non-weight-bearing" | null;
  favoriteSport?: string | null;
  about?: string | null;
}

// Journal Entry Types
export interface RehabTask {
  id: string;
  text: string;
  completed: boolean;
  order: number;
  journalEntryId: string;
}

export interface Win {
  id: string;
  win: string;
  order: number;
  journalEntryId: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  date: Date;
  emotion?: number | null;
  energyLevel?: number | null;
  painLevel?: number | null;
  swelling?: string | null;
  kneeFlexion?: string | null;
  kneeExtension?: string | null;
  rehabTasks: RehabTask[];
  dailyFocus?: string | null;
  selfCare?: string | null;
  wins: Win[];
  biggestChallenge?: string | null;
  lessonLearned?: string | null;
  improvement?: string | null;
  brainDump?: string | null;
  morningPlan?: string | null;
  middayPlan?: string | null;
  afternoonPlan?: string | null;
  eveningPlan?: string | null;
}

// Week View Types
export interface WeekEntry {
  id: string;
  number: number;
  dateRange: string;
  startDate: Date;
  endDate: Date;
  entries: ("completed" | "missed" | "future" | "disabled")[];
}
