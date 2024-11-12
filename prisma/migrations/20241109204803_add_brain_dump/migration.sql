-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "surgeryDate" TIMESTAMP(3) NOT NULL,
    "knee" TEXT NOT NULL,
    "graftType" TEXT NOT NULL,
    "weightBearing" TEXT NOT NULL,
    "favoriteSport" TEXT,
    "about" TEXT,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "emotion" INTEGER,
    "energyLevel" INTEGER,
    "painLevel" INTEGER,
    "swelling" TEXT,
    "kneeFlexion" TEXT,
    "kneeExtension" TEXT,
    "dailyFocus" TEXT,
    "selfCare" TEXT,
    "biggestChallenge" TEXT,
    "lessonLearned" TEXT,
    "improvement" TEXT,
    "brainDump" TEXT,
    "morningPlan" TEXT,
    "middayPlan" TEXT,
    "afternoonPlan" TEXT,
    "eveningPlan" TEXT,

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RehabTask" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "journalEntryId" TEXT NOT NULL,

    CONSTRAINT "RehabTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Win" (
    "id" TEXT NOT NULL,
    "win" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "journalEntryId" TEXT NOT NULL,

    CONSTRAINT "Win_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- CreateIndex
CREATE INDEX "JournalEntry_userId_idx" ON "JournalEntry"("userId");

-- CreateIndex
CREATE INDEX "JournalEntry_date_idx" ON "JournalEntry"("date");

-- CreateIndex
CREATE UNIQUE INDEX "JournalEntry_userId_date_key" ON "JournalEntry"("userId", "date");

-- CreateIndex
CREATE INDEX "RehabTask_journalEntryId_idx" ON "RehabTask"("journalEntryId");

-- CreateIndex
CREATE INDEX "Win_journalEntryId_idx" ON "Win"("journalEntryId");

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserSettings"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabTask" ADD CONSTRAINT "RehabTask_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Win" ADD CONSTRAINT "Win_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
