"use client";
import React, { useState, useEffect } from "react";
import SurgeryDate from "@/components/SurgeryDate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import KneeSelector from "@/components/KneeSelector";
import GraftTypeSelect from "@/components/GraftTypeSelect";
import WeightBearingStatus from "@/components/WeightBearingStatus";
import ProfileForm from "@/components/ProfileForm";
import { Button } from "@/components/ui/button";
import { createUpdateSettings, getSettings } from "@/utils/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

export default function SettingsPage() {
  const [surgeryDate, setSurgeryDate] = useState(null);
  const [knee, setKnee] = useState(null);
  const [graftType, setGraftType] = useState(null);
  const [weightBearing, setWeightBearing] = useState(null);
  const [favoriteSport, setFavoriteSport] = useState("");
  const [about, setAbout] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadSettings() {
      try {
        const result = await getSettings();
        if (result.success && result.data) {
          const settings = result.data;
          setSurgeryDate(
            settings.surgeryDate ? new Date(settings.surgeryDate) : null
          );
          setKnee(settings.knee || null);
          setGraftType(settings.graftType || null);
          setWeightBearing(settings.weightBearing || null);
          setFavoriteSport(settings.favoriteSport || "");
          setAbout(settings.about || "");
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
    setIsSubmitting(true);

    try {
      if (!surgeryDate) {
        toast({
          title: "Required Field Missing",
          description: "Please select your surgery date",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const formData = {
        surgeryDate: surgeryDate,
        knee: knee || "right",
        graftType: graftType || "patellar",
        weightBearing: weightBearing || "weight-bearing",
        favoriteSport: favoriteSport?.trim() || null,
        about: about?.trim() || null,
      };

      const result = await createUpdateSettings(formData);

      if (!result) {
        throw new Error("No response from server");
      }

      if (result.success) {
        toast({
          title: "Settings saved",
          description: "Your profile has been updated successfully.",
        });
      } else {
        throw new Error(result.error || "Failed to save settings");
      }
    } catch (error) {
      console.error("Settings submission error:", error);
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
        {/* SEO Heading */}
        <h1 className="sr-only">ACL Journey - Profile Settings</h1>

        {/* Title Section */}
        <div className="text-center md:text-left mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-darkb mb-2">
            Profile Settings
          </h2>
          <p className="text-silver_c text-sm md:text-base">
            Configure your ACL recovery profile and preferences
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Surgery Details Card */}
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
                value={surgeryDate}
                onChange={setSurgeryDate}
                required
              />
              <Separator className="bg-silver_c/20" />
              <KneeSelector value={knee} onChange={setKnee} />
              <Separator className="bg-silver_c/20" />
              <GraftTypeSelect value={graftType} onChange={setGraftType} />
              <Separator className="bg-silver_c/20" />
              <WeightBearingStatus
                value={weightBearing}
                onChange={setWeightBearing}
              />
            </CardContent>
          </Card>

          {/* Personal Details Card */}
          <Card className="border-silver_c/20">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-darkb">
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ProfileForm
                favoriteSport={favoriteSport}
                about={about}
                onSportChange={setFavoriteSport}
                onAboutChange={setAbout}
              />
            </CardContent>
          </Card>

          {/* Save Button */}
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
