import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createJournalEntry, getJournalEntry } from "@/utils/actions";
import { getLocalDate, formatDateForUrl } from "@/utils/date";
import { Save, Clock, Edit2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TodaysGamePlan() {
  const [plans, setPlans] = useState({
    morning: "",
    midDay: "",
    afternoon: "",
    evening: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const timeBlocks = [
    { id: "morning", label: "Morning", icon: "🌅" },
    { id: "midDay", label: "Mid-Day", icon: "☀️" },
    { id: "afternoon", label: "Afternoon", icon: "🌤️" },
    { id: "evening", label: "Evening", icon: "🌙" },
  ];

  // Get yesterday's date
  const getYesterdayDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return formatDateForUrl(yesterday);
  };

  // Load yesterday's plans
  useEffect(() => {
    async function loadPlans() {
      try {
        const yesterdayDate = getYesterdayDate();
        console.log("Fetching plans for:", yesterdayDate);

        const result = await getJournalEntry(yesterdayDate);
        console.log("Fetched journal entry:", result);

        if (result.success && result.data) {
          setPlans({
            morning: result.data.morningPlan || "",
            midDay: result.data.middayPlan || "",
            afternoon: result.data.afternoonPlan || "",
            evening: result.data.eveningPlan || "",
          });
        }
      } catch (error) {
        console.error("Error loading plans:", error);
      }
    }

    loadPlans();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const yesterdayDate = getYesterdayDate();

      const result = await createJournalEntry({
        date: yesterdayDate,
        timeBlockPlans: {
          morning: plans.morning,
          midDay: plans.midDay,
          afternoon: plans.afternoon,
          evening: plans.evening,
        },
      });

      if (result.success) {
        toast({
          title: "Success!",
          description: "Game plan updated successfully.",
        });
        setIsEditing(false);
      } else {
        throw new Error(result.error || "Failed to update game plan");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: "Failed to update game plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl md:text-3xl font-bold text-darkb">
        Today&apos;s Game Plan
      </h2>

      <Card className="border-silver_c/20 overflow-hidden">
        <CardHeader className="pb-4 pt-6 px-6">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-darkb flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Daily Schedule
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              disabled={isSaving}
              className="text-black hover:bg-silver_c hover:text-black border-silver_c/20"
            >
              {isSaving ? (
                <Save className="h-4 w-4 animate-spin" />
              ) : isEditing ? (
                <Check className="h-4 w-4" />
              ) : (
                <Edit2 className="h-4 w-4" />
              )}
              <span className="ml-2">{isEditing ? "Save" : "Edit"}</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {timeBlocks.map((block) => (
              <div
                key={block.id}
                className="space-y-2 bg-cream/30 p-4 rounded-lg border border-silver_c/10"
              >
                <h3 className="font-medium text-darkb flex items-center gap-2">
                  <span>{block.icon}</span>
                  {block.label}
                </h3>
                {isEditing ? (
                  <Textarea
                    value={plans[block.id]}
                    onChange={(e) =>
                      setPlans((prev) => ({
                        ...prev,
                        [block.id]: e.target.value,
                      }))
                    }
                    className="min-h-[100px] resize-none border-silver_c/20 bg-white"
                    placeholder={`Enter ${block.label.toLowerCase()} plans...`}
                  />
                ) : (
                  <p className="text-sm text-gray-600 whitespace-pre-wrap min-h-[100px]">
                    {plans[block.id] || "No plans set"}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
