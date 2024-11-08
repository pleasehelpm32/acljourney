"use client";

import React, { useState, useEffect } from "react";
import SurgeryDate from "@/components/SurgeryDate";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import KneeSelector from "@/components/KneeSelector";
import GraftTypeSelect from "@/components/GraftTypeSelect";
import WeightBearingStatus from "@/components/WeightBearingStatus";
import ProfileForm from "@/components/ProfileForm";
import { Button } from "@/components/ui/button";
import { createUpdateSettings, getSettings } from "@/utils/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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
      const formData = {
        surgeryDate,
        knee,
        graftType,
        weightBearing,
        favoriteSport,
        about,
      };

      const result = await createUpdateSettings(formData);

      if (result.success) {
        toast({
          title: "Settings saved",
          description: "Your profile has been updated successfully.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSubmit}>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Profile Settings
            </CardTitle>
            <CardDescription>
              Configure your ACL recovery profile and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Surgery Details</h3>
              <Separator />
              <SurgeryDate value={surgeryDate} onChange={setSurgeryDate} />
              <KneeSelector value={knee} onChange={setKnee} />
              <GraftTypeSelect value={graftType} onChange={setGraftType} />
              <WeightBearingStatus
                value={weightBearing}
                onChange={setWeightBearing}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Details</h3>
              <Separator />
              <ProfileForm
                favoriteSport={favoriteSport}
                about={about}
                onSportChange={setFavoriteSport}
                onAboutChange={setAbout}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
