//app/journal/[date]/page.js
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  getLocalDate,
  formatDateForUrl,
  formatDateForDisplay,
  formatFullDate,
} from "@/utils/date";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import JournalPostOpStats from "@/components/JournalPostOpStats";
import {
  PlusCircle,
  X,
  Clock,
  ArrowLeft,
  Save,
  ClipboardList,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import RehabTasks from "../../../components/journal/RehabTasks";
import { useRouter } from "next/navigation"; // Add this
import { useToast } from "@/hooks/use-toast";
import RequireSettings from "@/components/RequireSettings";

import {
  createJournalEntry,
  getJournalEntry,
  getSettings,
} from "@/utils/actions";

export default function JournalEntryPage({ params }) {
  const unwrappedParams = React.use(params);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const emotions = ["😭", "🙁", "😐", "🙂", "😃"];
  const levels = [0, 1, 2, 3, 4, 5];
  const swellingOptions = ["None", "Mild", "Moderate", "Severe"];
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [journalData, setJournalData] = useState(null);
  const rehabTasksRef = useRef(null);
  const { toast } = useToast();
  const [surgeryDate, setSurgeryDate] = useState(null);
  const focusFieldRef = useRef(null);
  const swellingFieldRef = useRef(null);
  const timeBlocks = [
    {
      id: "morning",
      label: "Morning",
      placeholder: "e.g., Ice therapy, gentle stretches, work from home...",
    },
    {
      id: "midDay",
      label: "Mid-Day",
      placeholder: "e.g., PT appointment, walking practice, lunch...",
    },
    {
      id: "afternoon",
      label: "Afternoon",
      placeholder: "e.g., Exercise session, work tasks, rest period...",
    },
    {
      id: "evening",
      label: "Evening",
      placeholder: "e.g., Recovery exercises, elevation time, sleep prep...",
    },
  ];
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
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
      mode: "onTouched",
    },
  });
  const scrollToError = () => {
    const firstError = Object.keys(errors)[0];
    if (firstError === "focus" && focusFieldRef.current) {
      focusFieldRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      focusFieldRef.current.focus();
    } else if (firstError === "swelling" && swellingFieldRef.current) {
      swellingFieldRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };
  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = getLocalDate(new Date(year, month - 1, day));

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formattedDate = formatDate(unwrappedParams.date);

  useEffect(() => {
    async function loadJournalEntry() {
      try {
        setIsLoading(true);

        const [journalResult, settingsResult] = await Promise.all([
          getJournalEntry(unwrappedParams.date),
          getSettings(),
        ]);

        console.log("Loaded journal entry:", journalResult);

        if (journalResult.success && journalResult.data) {
          const entry = journalResult.data;
          setJournalData(entry);

          // Reset form with loaded data - note the field name mappings
          reset({
            energyLevel: entry.energyLevel,
            painLevel: entry.painLevel,
            swelling: entry.swelling,
            kneeFlexion: entry.kneeFlexion || "",
            kneeExtension: entry.kneeExtension || "",
            focus: entry.dailyFocus || "", // Note: dailyFocus in DB maps to focus in form
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
          });

          // Set emotion state separately
          setSelectedEmotion(entry.emotion);

          // Set rehab tasks if you're using a ref
          if (rehabTasksRef.current && entry.rehabTasks) {
            rehabTasksRef.current.setTasks(entry.rehabTasks);
          }
        }

        if (settingsResult.success && settingsResult.data) {
          setSurgeryDate(settingsResult.data.surgeryDate);
        }
      } catch (error) {
        console.error("Error loading journal entry:", error);
        toast({
          title: "Error",
          description: "Failed to load journal entry.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (unwrappedParams.date) {
      loadJournalEntry();
    }
  }, [unwrappedParams.date, reset, toast]);

  const onSubmit = async (data) => {
    if (isSaving) return;

    try {
      setIsSaving(true);

      if (!unwrappedParams?.date) {
        throw new Error("Invalid date");
      }

      // Get tasks from ref
      const tasks = rehabTasksRef.current?.getTasks() || [];

      // Prepare form data with all fields
      const formData = {
        date: unwrappedParams.date,
        selectedEmotion,
        energyLevel: data.energyLevel,
        painLevel: data.painLevel,
        swelling: data.swelling || null,
        kneeFlexion: data.kneeFlexion || null,
        kneeExtension: data.kneeExtension || null,
        focus: data.focus || null,
        selfCare: data.selfCare || null,
        biggestChallenge: data.biggestChallenge || null,
        lessonLearned: data.lessonLearned || null,
        improvement: data.improvement || null,
        brainDump: data.brainDump || null,
        timeBlockPlans: {
          morning: data.timeBlockPlans?.morning || null,
          midDay: data.timeBlockPlans?.midDay || null,
          afternoon: data.timeBlockPlans?.afternoon || null,
          evening: data.timeBlockPlans?.evening || null,
        },
        tasks: tasks.filter((task) => task.text?.trim()),
        wins: (data.wins || []).filter((win) => win?.trim()),
      };

      const result = await createJournalEntry(formData);

      if (result?.success) {
        toast({
          title: "Success!",
          description: "Journal entry saved successfully.",
        });

        // Redirect to journal page
        router.push("/journal");
      } else {
        throw new Error(result?.error || "Failed to save journal entry");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to save journal entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const onError = (errors) => {
    console.log("Form errors:", errors);
    scrollToError();
  };

  // Form section component for better organization
  const FormSection = ({ title, children, className }) => (
    <div className={cn("space-y-4", className)}>
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-sm font-medium text-muted-foreground">
            {title}
          </span>
        </div>
      </div>
      {children}
    </div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-3xl flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Save className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading journal entry...</p>
        </div>
      </div>
    );
  }
  const formatDateForUrl = (date) => {
    const d = new Date(date);
    d.setHours(12, 0, 0, 0); // Set to noon

    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();

    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
  };

  const getAdjacentDates = (dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const currentDate = getLocalDate(new Date(year, month - 1, day));
    currentDate.setHours(0, 0, 0, 0);

    const prevDate = new Date(currentDate);
    prevDate.setDate(currentDate.getDate() - 1);

    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);

    return {
      prevDay: formatDateForUrl(prevDate),
      nextDay: formatDateForUrl(nextDate),
    };
  };

  const getPostOpDuration = (surgeryDate) => {
    if (!surgeryDate) return null;

    const diffTime = Math.abs(new Date() - new Date(surgeryDate));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    const remainingDays = diffDays % 7;

    return {
      weeks,
      days: remainingDays,
      text: `${weeks} ${weeks === 1 ? "week" : "weeks"}${
        remainingDays > 0
          ? ` and ${remainingDays} ${remainingDays === 1 ? "day" : "days"}`
          : ""
      } post-surgery`,
    };
  };

  const handleKeyDown = (e) => {
    // Prevent form submission on Enter key in single-line inputs
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();
    }
  };
  return (
    <RequireSettings>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="container mx-auto px-4 py-6 md:py-8 max-w-3xl space-y-6"
      >
        {/* Header Section */}
        <div className="space-y-4 mb-6">
          {/* Navigation */}
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

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link
                href={`/journal/${
                  getAdjacentDates(unwrappedParams.date).prevDay
                }`}
                className="flex-1 sm:flex-none"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto gap-1 text-black hover:bg-silver_c hover:text-black border-silver_c/20"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </Button>
              </Link>

              {new Date(unwrappedParams.date) <
                new Date(formatDateForUrl(new Date())) && (
                <Link
                  href={`/journal/${
                    getAdjacentDates(unwrappedParams.date).nextDay
                  }`}
                  className="flex-1 sm:flex-none"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto gap-1 text-black hover:bg-silver_c hover:text-black border-silver_c/20"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Title and Date */}
          <div className="text-center sm:text-left space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-darkb">
              Journal Entry
            </h1>
            <div className="space-y-1">
              <p className="text-black text-sm md:text-base">{formattedDate}</p>
              {surgeryDate && (
                <JournalPostOpStats entryDate={unwrappedParams.date} />
              )}
            </div>
          </div>
        </div>

        <Card className="border-silver_c/20">
          <CardContent className="p-4 md:p-6 space-y-8">
            {/* Emotion Selection */}
            <FormSection title="Emotional & Energy Status">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-darkb">Today I feel...</Label>
                  <div className="grid grid-cols-5 gap-2 md:gap-4">
                    {emotions.map((emoji, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="outline"
                        className={cn(
                          "text-2xl h-12 w-full transition-all hover:scale-105 hover:bg-silver_c/20",
                          selectedEmotion === index &&
                            "border-darkb border-2 shadow-md"
                        )}
                        onClick={() => setSelectedEmotion(index)}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Energy Level */}
                <div className="space-y-3">
                  <Label className="text-darkb">Energy Level</Label>
                  <Controller
                    name="energyLevel"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-6 gap-2">
                        {levels.map((level) => (
                          <Button
                            key={level}
                            type="button"
                            variant="outline"
                            onClick={() => field.onChange(level)}
                            className={cn(
                              "h-12 w-full font-semibold transition-all hover:bg-silver_c/20",
                              field.value === level
                                ? `bg-gradient-to-r ${
                                    level <= 1
                                      ? "from-red-500 to-red-600"
                                      : level <= 3
                                      ? "from-yellow-500 to-yellow-600"
                                      : "from-green-500 to-green-600"
                                  } text-white`
                                : "text-black"
                            )}
                          >
                            {level}
                          </Button>
                        ))}
                      </div>
                    )}
                  />
                  <div className="flex justify-between text-sm text-black">
                    <span>Very Drained</span>
                    <span>Energized</span>
                  </div>
                </div>
              </div>
            </FormSection>

            {/* Physical Status */}
            <FormSection title="Physical Status">
              <div className="space-y-6">
                {/* Pain Scale */}
                <div className="space-y-3">
                  <Label className="text-darkb">Knee Pain Level</Label>
                  <Controller
                    name="painLevel"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-6 gap-2">
                        {levels.map((level) => (
                          <Button
                            key={level}
                            type="button"
                            variant="outline"
                            onClick={() => field.onChange(level)}
                            className={cn(
                              "h-12 w-full font-semibold transition-all hover:bg-silver_c/20",
                              field.value === level
                                ? `bg-gradient-to-r ${
                                    level >= 4
                                      ? "from-red-500 to-red-600"
                                      : level >= 2
                                      ? "from-yellow-500 to-yellow-600"
                                      : "from-green-500 to-green-600"
                                  } text-white`
                                : "text-black"
                            )}
                          >
                            {level}
                          </Button>
                        ))}
                      </div>
                    )}
                  />
                  <div className="flex justify-between text-sm text-black">
                    <span>None</span>
                    <span>Severe</span>
                  </div>
                </div>

                {/* Swelling */}
                <div className="space-y-3" ref={swellingFieldRef}>
                  <Label className="text-darkb">Swelling</Label>
                  <Controller
                    name="swelling"
                    control={control}
                    rules={{ required: "Please select swelling level" }}
                    render={({ field }) => (
                      <div className="space-y-3">
                        <RadioGroup
                          className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4"
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          {swellingOptions.map((option) => (
                            <div
                              key={option}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={option.toLowerCase()}
                                id={option.toLowerCase()}
                              />
                              <Label
                                htmlFor={option.toLowerCase()}
                                className="text-black"
                              >
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        {errors.swelling && (
                          <div className="text-sm text-red-500 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            {errors.swelling.message}
                          </div>
                        )}
                      </div>
                    )}
                  />
                </div>

                {/* Knee Measurements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-darkb">Knee Flexion</Label>
                    <Input
                      {...register("kneeFlexion")}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g., Full, 130°, Limited to 90°"
                      className="border-silver_c/20 text-black placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-darkb">Knee Extension</Label>
                    <Input
                      {...register("kneeExtension")}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g., Full, -5°, Limited by 10°"
                      className="border-silver_c/20 text-black placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>
            </FormSection>

            {/* Rehab Tasks */}
            <FormSection title="Rehab Progress">
              <RehabTasks
                ref={rehabTasksRef}
                initialTasks={journalData?.rehabTasks || []}
              />
            </FormSection>

            {/* Focus & Self-Care */}
            <FormSection title="Mindset & Well-being">
              <div className="space-y-6">
                <div className="space-y-3" ref={focusFieldRef}>
                  <Label className="text-darkb">
                    My biggest focus today is
                  </Label>
                  <Textarea
                    {...register("focus", {
                      required: "Please enter your main focus",
                      onChange: (e) => {
                        e.target.value = e.target.value; // Prevent default behavior
                      },
                    })}
                    placeholder="Enter your main focus for today..."
                    className={cn(
                      "border-silver_c/20 text-black placeholder:text-gray-400",
                      errors.focus && "border-red-500 focus:border-red-500"
                    )}
                  />
                  {errors.focus && (
                    <div className="text-sm text-red-500 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {errors.focus.message}
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <Label className="text-darkb">
                    One thing I am doing for me today is
                  </Label>
                  <Textarea
                    {...register("selfCare")}
                    placeholder="What are you doing for self-care today?"
                    className="border-silver_c/20 text-black placeholder:text-gray-400"
                  />
                </div>
              </div>
            </FormSection>

            {/* Wins & Reflections */}
            <FormSection title="Progress & Reflections">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Wins */}
                  <div className="space-y-4">
                    <Label className="text-darkb">Three Wins Today</Label>
                    {[0, 1, 2].map((index) => (
                      <Input
                        key={index}
                        {...register(`wins.${index}`)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Win #${index + 1}`}
                        className="border-silver_c/20 text-black placeholder:text-gray-400"
                      />
                    ))}
                  </div>

                  {/* Reflections */}
                  <div className="space-y-4">
                    <Label className="text-darkb">Reflections</Label>
                    <div className="space-y-4">
                      <Input
                        {...register("biggestChallenge")}
                        onKeyDown={handleKeyDown}
                        placeholder="What challenged you today?"
                        className="border-silver_c/20 text-black placeholder:text-gray-400"
                      />
                      <Input
                        {...register("lessonLearned")}
                        onKeyDown={handleKeyDown}
                        placeholder="What did you learn?"
                        className="border-silver_c/20 text-black placeholder:text-gray-400"
                      />
                      <Input
                        {...register("improvement")}
                        onKeyDown={handleKeyDown}
                        placeholder="What could be better?"
                        className="border-silver_c/20 text-black placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-darkb">Brain Dump</Label>
                  <Textarea
                    {...register("brainDump")}
                    placeholder="Use this space for any additional thoughts, feelings, or notes about your day..."
                    className="min-h-[150px] border-silver_c/20 text-black placeholder:text-gray-400"
                  />
                </div>
              </div>
            </FormSection>

            {/* Game Plan */}
            <FormSection title="Tomorrow's Game Plan">
              <div className="space-y-6">
                {timeBlocks.map((block) => (
                  <div key={block.id} className="space-y-3">
                    <Label className="text-darkb">{block.label}</Label>
                    <Textarea
                      {...register(`timeBlockPlans.${block.id}`)}
                      placeholder={block.placeholder}
                      rows={2}
                      className="resize-none border-silver_c/20 text-black placeholder:text-gray-400"
                    />
                  </div>
                ))}
              </div>
            </FormSection>

            {/* Submit Button */}
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
          </CardContent>
        </Card>
      </form>
    </RequireSettings>
  );
}
