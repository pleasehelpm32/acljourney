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

export default function JournalEntryPage({ params }) {
  const unwrappedParams = React.use(params);
  // Form handling with validation
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
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

  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const emotions = ["😭", "🙁", "😐", "🙂", "😃"];
  const levels = [0, 1, 2, 3, 4, 5];
  const swellingOptions = ["None", "Mild", "Moderate", "Severe"];

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

  // Auto-save functionality
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (isSaving) {
        // Save logic here
        console.log("Saving...");
        setIsSaving(false);
      }
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [isSaving]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const formattedDate = formatDate(unwrappedParams.date);

  const rehabTasksRef = useRef(null);

  // Update your onSubmit function
  const onSubmit = (data) => {
    // Get tasks from ref only during submission
    const tasks = rehabTasksRef.current?.getTasks() || [];

    console.log({
      ...data,
      tasks,
      selectedEmotion,
    });
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
                <RadioGroup
                  className="flex flex-wrap gap-4"
                  {...register("swelling", {
                    required: "Please select swelling level",
                  })}
                >
                  {swellingOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={option.toLowerCase()}
                        id={option.toLowerCase()}
                      />
                      <Label htmlFor={option.toLowerCase()}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
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
            <RehabTasks ref={rehabTasksRef} />
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
