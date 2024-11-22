//journal/[date]/page.js
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavigationButtons } from "@/components/journal/NavigationButtons";
import Link from "next/link";
import { ArrowLeft, Save, ChevronLeft, ChevronRight } from "lucide-react";

import { createSafeDate, formatDateForUrl, formatFullDate } from "@/utils/date";

import {
  createJournalEntry,
  getJournalEntry,
  getSettings,
} from "@/utils/actions";
import RequireSettings from "@/components/RequireSettings";
import JournalPostOpStats from "@/components/JournalPostOpStats";
import RehabTasks from "@/components/journal/RehabTasks";
import { EmotionalStatus } from "@/components/journal/form/EmotionalStatus";
import { PhysicalStatus } from "@/components/journal/form/PhysicalStatus";
import { GamePlan } from "@/components/journal/form/GamePlan";
import { MindsetWellbeing } from "@/components/journal/form/MindsetWellbeing";
import { ProgressReflections } from "@/components/journal/form/ProgressReflections";

import { FormSection } from "@/components/ui/form-section";

const DEFAULT_FORM_VALUES = {
  emotion: null,
  energyLevel: null,
  painLevel: null,
  swelling: null,
  kneeFlexion: "",
  kneeExtension: "",
  focus: "",
  selfCare: "",
  biggestChallenge: "",
  lessonLearned: "",
  improvement: "",
  brainDump: "",
  wins: ["", "", ""],
  timeBlockPlans: {
    morning: "",
    midDay: "",
    afternoon: "",
    evening: "",
  },
};

export default function JournalEntryPage({ params }) {
  const unwrappedParams = React.use(params);
  const [pageState, setPageState] = useState({
    selectedEmotion: null,
    isSaving: false,
    isLoading: true,
    journalData: null,
    surgeryDate: null,
    rehabTasksRef: useRef(null),
  });

  const router = useRouter();
  const { toast } = useToast();
  const swellingRef = useRef(null);

  const focusFieldRef = useRef(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onTouched",
  });

  function prepareFormData(data) {
    const tasks = pageState.rehabTasksRef.current?.getTasks() || [];
    return {
      date: unwrappedParams.date,
      selectedEmotion: pageState.selectedEmotion,
      ...data,
      tasks: tasks.filter((task) => task.text?.trim()),
      wins: (data.wins || []).filter((win) => win?.trim()),
    };
  }

  const onSubmit = async (data) => {
    if (pageState.isSaving) return;
    try {
      setPageState((prev) => ({ ...prev, isSaving: true }));
      const formData = prepareFormData(data);
      const result = await createJournalEntry(formData);

      if (result?.success) {
        toast({
          title: "Success!",
          description: "Journal entry saved successfully.",
        });
        router.push("/journal");
      } else {
        throw new Error(result?.error || "Failed to save journal entry");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to save journal entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPageState((prev) => ({ ...prev, isSaving: false }));
    }
  };

  useEffect(() => {
    loadJournalEntry();
  }, [unwrappedParams.date]);

  async function loadJournalEntry() {
    try {
      const [journalResult, settingsResult] = await Promise.all([
        getJournalEntry(unwrappedParams.date),
        getSettings(),
      ]);

      if (journalResult.success && journalResult.data) {
        const entry = journalResult.data;
        setPageState((prev) => ({
          ...prev,
          journalData: entry,
          selectedEmotion: entry.emotion,
        }));

        reset(mapEntryToFormData(entry));

        if (pageState.rehabTasksRef.current && entry.rehabTasks) {
          pageState.rehabTasksRef.current.setTasks(entry.rehabTasks);
        }
      }

      if (settingsResult.success && settingsResult.data) {
        setPageState((prev) => ({
          ...prev,
          surgeryDate: settingsResult.data.surgeryDate,
        }));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load journal entry.",
        variant: "destructive",
      });
    } finally {
      setPageState((prev) => ({ ...prev, isLoading: false }));
    }
  }

  const onError = (errors) => {
    console.log("Form errors:", errors);
    const firstError = Object.keys(errors)[0];

    // Add a small delay to ensure DOM is updated
    setTimeout(() => {
      if (firstError === "focus" && focusFieldRef.current) {
        focusFieldRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        focusFieldRef.current.focus();
      } else if (firstError === "swelling" && swellingRef.current) {
        swellingRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();
    }
  };

  if (pageState.isLoading) {
    return <LoadingSpinner />;
  }

  const scrollToError = () => {
    const firstError = Object.keys(errors)[0];
    if (firstError === "focus" && focusFieldRef.current) {
      focusFieldRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      focusFieldRef.current.focus();
    } else if (firstError === "swelling" && swellingRef.current) {
      swellingRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <RequireSettings>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="container mx-auto px-4 py-6 md:py-8 max-w-3xl space-y-6"
      >
        <JournalHeader
          date={unwrappedParams.date}
          surgeryDate={pageState.surgeryDate}
        />

        <Card className="border-silver_c/20">
          <CardContent className="p-4 md:p-6 space-y-8">
            <FormSection title="Emotional & Energy Status">
              <EmotionalStatus
                control={control}
                selectedEmotion={pageState.selectedEmotion}
                onEmotionChange={(emotion) =>
                  setPageState((prev) => ({
                    ...prev,
                    selectedEmotion: emotion,
                  }))
                }
              />
            </FormSection>

            <FormSection title="Physical Status">
              <PhysicalStatus
                ref={swellingRef}
                control={control}
                register={register}
                errors={errors}
                handleKeyDown={handleKeyDown}
              />
            </FormSection>

            <FormSection title="Rehab Progress">
              <RehabTasks
                ref={pageState.rehabTasksRef}
                initialTasks={pageState.journalData?.rehabTasks || []}
              />
            </FormSection>

            <FormSection title="Mindset & Well-being">
              <MindsetWellbeing
                register={register}
                errors={errors}
                focusFieldRef={focusFieldRef}
              />
            </FormSection>

            <FormSection title="Progress & Reflections">
              <ProgressReflections
                register={register}
                handleKeyDown={handleKeyDown}
              />
            </FormSection>

            <FormSection title="Tomorrow's Game Plan">
              <GamePlan register={register} />
            </FormSection>

            <SubmitButton isSaving={pageState.isSaving} />
          </CardContent>
        </Card>
      </form>
    </RequireSettings>
  );
}

function LoadingSpinner() {
  return (
    <div className="container mx-auto p-4 max-w-3xl flex justify-center items-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-2">
        <Save className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">Loading journal entry...</p>
      </div>
    </div>
  );
}

function JournalHeader({ date, surgeryDate }) {
  const parsedDate = new Date(date);
  parsedDate.setDate(parsedDate.getDate() + 1);

  const formattedDate = formatFullDate(parsedDate);
  const { prevDay, nextDay } = getAdjacentDates(date);
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:justify-between">
        <Link href="/journal" className="w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full sm:w-auto gap-2 text-black hover:bg-silver_c hover:text-black border-silver_c/20"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Journal
          </Button>
        </Link>

        <NavigationButtons date={date} prevDay={prevDay} nextDay={nextDay} />
      </div>

      <div className="text-center sm:text-left space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-darkb">
          Journal Entry
        </h1>
        <div className="space-y-1">
          <p className="text-black text-sm md:text-base">{formattedDate}</p>
          {surgeryDate && <JournalPostOpStats entryDate={date} />}
        </div>
      </div>
    </div>
  );
}

function SubmitButton({ isSaving }) {
  return (
    <Button
      type="submit"
      className="w-full bg-silver_c text-black hover:bg-black hover:text-cream transition-all py-6"
      disabled={isSaving}
    >
      {isSaving ? (
        <>
          <span className="opacity-0">Save Journal Entry</span>
          <span className="absolute inset-0 flex items-center justify-center gap-2">
            <Save className="h-4 w-4 animate-spin" />
            <span>Saving...</span>
          </span>
        </>
      ) : (
        <>
          <Save className="h-4 w-4 mr-2" />
          <span>Save Journal Entry</span>
        </>
      )}
    </Button>
  );
}

// Helper functions
function mapEntryToFormData(entry) {
  return {
    energyLevel: entry.energyLevel,
    painLevel: entry.painLevel,
    swelling: entry.swelling,
    kneeFlexion: entry.kneeFlexion || "",
    kneeExtension: entry.kneeExtension || "",
    focus: entry.dailyFocus || "",
    selfCare: entry.selfCare || "",
    biggestChallenge: entry.biggestChallenge || "",
    lessonLearned: entry.lessonLearned || "",
    improvement: entry.improvement || "",
    brainDump: entry.brainDump || "",
    timeBlockPlans: {
      morning: entry.morningPlan || "",
      midDay: entry.middayPlan || "",
      afternoon: entry.afternoonPlan || "",
      evening: entry.eveningPlan || "",
    },
    wins: entry.wins?.map((w) => w.win || "") || ["", "", ""],
  };
}
function getAdjacentDates(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const currentDate = createSafeDate(new Date(year, month - 1, day));

  const prevDate = new Date(currentDate);
  prevDate.setDate(currentDate.getDate() - 1);

  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() + 1);

  return {
    prevDay: formatDateForUrl(prevDate),
    nextDay: formatDateForUrl(nextDate),
  };
}
