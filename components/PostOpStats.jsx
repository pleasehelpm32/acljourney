"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getSurgeryDate } from "@/utils/actions";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PostOpStats() {
  const [surgeryDate, setSurgeryDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSurgeryDate() {
      const result = await getSurgeryDate();
      if (result.success) {
        setSurgeryDate(result.data);
      }
      setIsLoading(false);
    }

    loadSurgeryDate();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // If no surgery date is set, show placeholder with settings link
  if (!surgeryDate) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-muted-foreground">
          Recovery Timeline
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center space-y-2">
                <span className="text-4xl font-bold text-primary">?</span>
                <span className="text-sm text-muted-foreground font-medium">
                  Weeks
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center space-y-2">
                <span className="text-4xl font-bold text-primary">?</span>
                <span className="text-sm text-muted-foreground font-medium">
                  Days
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Add settings prompt */}
          <Card className="col-span-2 relative overflow-hidden border-dashed border-primary/50">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <AlertCircle className="h-5 w-5" />
                  <span>Surgery date not set</span>
                </div>
                <Link href="/settings">
                  <Button>Go to Settings</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Your existing code for when surgery date is set
  const today = new Date();
  const diffTime = Math.abs(today - surgeryDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(diffDays / 7);
  const remainingDays = diffDays % 7;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-muted-foreground">
        Recovery Timeline
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center space-y-2">
              <span className="text-4xl font-bold text-primary">{weeks}</span>
              <span className="text-sm text-muted-foreground font-medium">
                {weeks === 1 ? "Week" : "Weeks"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center space-y-2">
              <span className="text-4xl font-bold text-primary">
                {remainingDays}
              </span>
              <span className="text-sm text-muted-foreground font-medium">
                {remainingDays === 1 ? "Day" : "Days"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
