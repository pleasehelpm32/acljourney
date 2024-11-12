// components/RequireSettings.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSettings } from "@/utils/actions";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export default function RequireSettings({ children }) {
  const [hasSettings, setHasSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function checkSettings() {
      try {
        const result = await getSettings();
        setHasSettings(result.success && result.data?.surgeryDate);
      } catch (error) {
        console.error("Error checking settings:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkSettings();
  }, []);

  if (isLoading) {
    return null; // Or a loading spinner if preferred
  }

  if (!hasSettings) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="pt-6 text-center space-y-4">
            <h2 className="text-2xl font-bold">Setup Required</h2>
            <p className="text-muted-foreground">
              Before you can start journaling, we need some information about
              your ACL surgery. This helps us personalize your recovery
              tracking.
            </p>
            <Button onClick={() => router.push("/settings")} className="gap-2">
              <Settings className="h-4 w-4" />
              Configure Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return children;
}
