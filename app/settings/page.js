"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createUpdateSettings, getSettings } from "@/utils/actions";

// Your existing components
import SurgeryDate from "@/components/SurgeryDate";
import KneeSelector from "@/components/KneeSelector";
import GraftTypeSelect from "@/components/GraftTypeSelect";
import WeightBearingStatus from "@/components/WeightBearingStatus";
import ProfileForm from "@/components/ProfileForm";

const DEFAULT_STATE = {
  surgeryDate: null,
  knee: null,
  graftType: null,
  weightBearing: null,
  favoriteSport: "",
  about: "",
};

export default function SettingsPage() {
  const [formData, setFormData] = useState(DEFAULT_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadSettings() {
      try {
        const result = await getSettings();
        if (result.success && result.data) {
          setFormData({
            surgeryDate: result.data.surgeryDate
              ? new Date(result.data.surgeryDate)
              : null,
            knee: result.data.knee || null,
            graftType: result.data.graftType || null,
            weightBearing: result.data.weightBearing || null,
            favoriteSport: result.data.favoriteSport || "",
            about: result.data.about || "",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load settings. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.surgeryDate) {
      toast({
        title: "Required Field Missing",
        description: "Please select your surgery date",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createUpdateSettings(formData);
      if (result?.success) {
        toast({
          title: "Settings saved",
          description: "Your profile has been updated successfully.",
        });
      } else {
        throw new Error(result?.error || "Failed to save settings");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Save className="h-8 w-8 animate-spin text-darkb" />
          <p className="text-darkb">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-3xl">
        <h1 className="sr-only">ACL Journey - Profile Settings</h1>

        <div className="text-center md:text-left mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-darkb mb-2">
            Profile Settings
          </h2>
          <p className="text-silver_c text-sm md:text-base">
            Configure your ACL recovery profile and preferences
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-silver_c/20">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-darkb flex justify-between items-center">
                Surgery Details
                <span className="text-sm text-silver_c font-normal">
                  * Surgery date required
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <SurgeryDate
                value={formData.surgeryDate}
                onChange={(date) =>
                  setFormData((prev) => ({ ...prev, surgeryDate: date }))
                }
              />
              <Separator className="bg-silver_c/20" />
              <KneeSelector
                value={formData.knee}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, knee: value }))
                }
              />
              <Separator className="bg-silver_c/20" />
              <GraftTypeSelect
                value={formData.graftType}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, graftType: value }))
                }
              />
              <Separator className="bg-silver_c/20" />
              <WeightBearingStatus
                value={formData.weightBearing}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, weightBearing: value }))
                }
              />
            </CardContent>
          </Card>

          <Card className="border-silver_c/20">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-darkb">
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ProfileForm
                favoriteSport={formData.favoriteSport}
                about={formData.about}
                onSportChange={(value) =>
                  setFormData((prev) => ({ ...prev, favoriteSport: value }))
                }
                onAboutChange={(value) =>
                  setFormData((prev) => ({ ...prev, about: value }))
                }
              />
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full bg-silver_c text-black hover:bg-black hover:text-cream transition-all py-6"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
