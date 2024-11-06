"use client";

import React from "react";
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

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
          <CardDescription>
            Configure your ACL recovery profile and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Surgery Details</h3>
            <Separator />
            <SurgeryDate />
            <KneeSelector />
            <GraftTypeSelect />
            <WeightBearingStatus />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Details</h3>
            <Separator />
            <ProfileForm />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
