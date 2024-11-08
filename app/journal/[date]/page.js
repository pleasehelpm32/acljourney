"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  PlusCircle,
  X,
  Clock,
  ArrowLeft,
  Save,
  ClipboardList,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import RehabTasks from "../../../components/journal/RehabTasks";
import { useRouter } from "next/navigation"; // Add this
import { useToast } from "@/hooks/use-toast";

import { createJournalEntry, getJournalEntry } from "@/utils/actions";

export default function JournalEntryPage({ params }) {
  const unwrappedParams = React.use(params);

  // Form handling with validation

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
      wins: ["", "", ""],
      timeBlockPlans: {
        morning: "",
        midDay: "",
        afternoon: "",
        evening: "",
      },
    },
  });

  const formatDate = (dateStr) => {
    // Split the date string into components
    const [year, month, day] = dateStr.split("-").map(Number);

    // Create date using local timezone (months are 0-based in JavaScript)
    const date = new Date(year, month - 1, day, 12, 0, 0);

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
        const result = await getJournalEntry(unwrappedParams.date);

        if (result.success && result.data) {
          const entry = result.data;
          setJournalData(entry); // Store the result in state

          // Reset form with existing data
          reset({
            energyLevel: entry.energyLevel,
            painLevel: entry.painLevel,
            swelling: entry.swelling,
            kneeFlexion: entry.kneeFlexion,
            kneeExtension: entry.kneeExtension,
            focus: entry.dailyFocus,
            selfCare: entry.selfCare,
            biggestChallenge: entry.biggestChallenge,
            lessonLearned: entry.lessonLearned,
            improvement: entry.improvement,
            timeBlockPlans: {
              morning: entry.morningPlan,
              midDay: entry.middayPlan,
              afternoon: entry.afternoonPlan,
              evening: entry.eveningPlan,
            },
            wins: entry.wins.map((w) => w.win),
          });

          setSelectedEmotion(entry.emotion);
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

    loadJournalEntry();
  }, [unwrappedParams.date, reset, toast]);

  const onSubmit = async (data) => {
    try {
      setIsSaving(true);
      const tasks = rehabTasksRef.current?.getTasks() || [];

      const entryDate = new Date(unwrappedParams.date);
      entryDate.setHours(12, 0, 0, 0);

      const formData = {
        date: (() => {
          const d = new Date(unwrappedParams.date);
          d.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues

          return d;
        })(),
        selectedEmotion,
        energyLevel: data.energyLevel,
        painLevel: data.painLevel,
        swelling: data.swelling,
        kneeFlexion: data.kneeFlexion,
        kneeExtension: data.kneeExtension,
        focus: data.focus,
        selfCare: data.selfCare,
        biggestChallenge: data.biggestChallenge,
        lessonLearned: data.lessonLearned,
        improvement: data.improvement,
        timeBlockPlans: {
          morning: data.timeBlockPlans.morning || "",
          midDay: data.timeBlockPlans.midDay || "",
          afternoon: data.timeBlockPlans.afternoon || "",
          evening: data.timeBlockPlans.evening || "",
        },
        tasks: tasks.map((task) => ({
          text: task.text || "",
          completed: Boolean(task.completed),
        })),
        wins: data.wins.filter((win) => win.trim() !== ""), // Filter out empty wins
      };

      // Log the full form data
      console.log("Full form data:", formData);

      if (!formData.date) {
        throw new Error("Date is required");
      }

      const result = await createJournalEntry(formData);

      if (result.success) {
        toast({
          title: "Success!",
          description: "Journal entry saved successfully.",
        });
        router.push("/journal");
      } else {
        throw new Error(result.error || "Failed to save journal entry");
      }
    } catch (error) {
      console.error("Error saving journal entry:", error);
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="container mx-auto p-4 max-w-3xl space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col space-y-1.5 mb-6">
        <div className="flex items-center gap-2">
          <Link href="/journal">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Journal
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold">Journal Entry</h1>
        <p className="text-muted-foreground">{formattedDate}</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-8">
          {/* Emotion Selection */}
          <FormSection title="Emotional & Energy Status">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Today I feel...</Label>
                <div className="flex justify-between gap-2 md:gap-4">
                  {emotions.map((emoji, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      className={cn(
                        "text-2xl h-12 w-12 transition-all hover:scale-105",
                        selectedEmotion === index &&
                          "border-primary border-2 shadow-md"
                      )}
                      onClick={() => setSelectedEmotion(index)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>

                {errors.emotion && (
                  <p className="text-sm text-red-500 mt-1">
                    Please select how you feel
                  </p>
                )}
              </div>

              {/* Energy Level - Updated version */}
              <div className="space-y-2">
                <Label>Energy Level</Label>
                <Controller
                  name="energyLevel"
                  control={control}
                  render={({ field }) => (
                    <div className="flex justify-between gap-2">
                      {levels.map((level) => (
                        <Button
                          key={level}
                          type="button"
                          variant="outline"
                          onClick={() => field.onChange(level)}
                          className={cn(
                            "h-12 w-12 font-semibold transition-all hover:scale-105",
                            field.value === level &&
                              `bg-gradient-to-r ${
                                level <= 1
                                  ? "from-red-500 to-red-600"
                                  : level <= 3
                                  ? "from-yellow-500 to-yellow-600"
                                  : "from-green-500 to-green-600"
                              } text-white`
                          )}
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                  )}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Very Drained</span>
                  <span>Energized</span>
                </div>
              </div>
            </div>
          </FormSection>

          {/* Physical Status Section */}
          <FormSection title="Physical Status">
            <div className="space-y-6">
              {/* Pain Scale */}
              <div className="space-y-2">
                <Label>Knee Pain Level</Label>
                <Controller
                  name="painLevel"
                  control={control}
                  render={({ field }) => (
                    <div className="flex justify-between gap-2">
                      {levels.map((level) => (
                        <Button
                          key={level}
                          type="button"
                          variant="outline"
                          onClick={() => field.onChange(level)}
                          className={cn(
                            "h-12 w-12 font-semibold transition-all hover:scale-105",
                            field.value === level &&
                              `bg-gradient-to-r ${
                                level >= 4
                                  ? "from-red-500 to-red-600"
                                  : level >= 2
                                  ? "from-yellow-500 to-yellow-600"
                                  : "from-green-500 to-green-600"
                              } text-white`
                          )}
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                  )}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>None</span>
                  <span>Severe</span>
                </div>
              </div>

              {/* Swelling */}
              <div className="space-y-2">
                <Label>Swelling</Label>
                <Controller
                  name="swelling"
                  control={control}
                  rules={{ required: "Please select swelling level" }}
                  render={({ field }) => (
                    <RadioGroup
                      className="flex flex-wrap gap-4"
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
                          <Label htmlFor={option.toLowerCase()}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                />
                {errors.swelling && (
                  <p className="text-sm text-red-500">
                    {errors.swelling.message}
                  </p>
                )}
              </div>

              {/* Knee Measurements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Knee Flexion</Label>
                  <Input
                    {...register("kneeFlexion")}
                    placeholder="e.g., Full, 130°, Limited to 90°"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Knee Extension</Label>
                  <Input
                    {...register("kneeExtension")}
                    placeholder="e.g., Full, -5°, Limited by 10°"
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>My biggest focus today is</Label>
                <Textarea
                  {...register("focus", {
                    required: "Please enter your main focus",
                  })}
                  placeholder="Enter your main focus for today..."
                />
                {errors.focus && (
                  <p className="text-sm text-red-500">{errors.focus.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>One thing I am doing for me today is</Label>
                <Textarea
                  {...register("selfCare")}
                  placeholder="What are you doing for self-care today?"
                />
              </div>
            </div>
          </FormSection>

          {/* Wins & Reflections */}
          <FormSection title="Progress & Reflections">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Wins */}
              <div className="space-y-4">
                <Label>Three Wins Today</Label>
                {[0, 1, 2].map((index) => (
                  <div key={index} className="space-y-2">
                    <Input
                      {...register(`wins.${index}`)}
                      placeholder={`Win #${index + 1}`}
                    />
                  </div>
                ))}
              </div>

              {/* Reflections */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Biggest Challenge</Label>
                  <Input
                    {...register("biggestChallenge")}
                    placeholder="What challenged you today?"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Lesson Learned</Label>
                  <Input
                    {...register("lessonLearned")}
                    placeholder="What did you learn?"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Area for Improvement</Label>
                  <Input
                    {...register("improvement")}
                    placeholder="What could be better?"
                  />
                </div>
              </div>
            </div>
          </FormSection>

          {/* Game Plan Section */}
          <FormSection title="Tomorrow's Game Plan">
            <div className="space-y-4">
              <div className="grid gap-4">
                {timeBlocks.map((block) => (
                  <div
                    key={block.id}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center"
                  >
                    <div className="md:col-span-1">
                      <Label className="text-sm font-medium text-muted-foreground">
                        {block.label}
                      </Label>
                    </div>
                    <div className="md:col-span-4">
                      <Textarea
                        {...register(`timeBlockPlans.${block.id}`)}
                        placeholder={block.placeholder}
                        className="resize-none"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FormSection>

          {/* Submit Button */}
          <Button type="submit" className="w-full relative" disabled={isSaving}>
            {isSaving ? (
              <>
                <span className="opacity-0">Save Journal Entry</span>
                <span className="absolute inset-0 flex items-center justify-center gap-2">
                  <Save className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Journal Entry
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
