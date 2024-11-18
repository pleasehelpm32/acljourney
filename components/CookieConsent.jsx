"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowConsent(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/20 backdrop-blur-sm z-50">
      <Card className="max-w-3xl mx-auto border-silver_c/20">
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm md:text-base text-darkb mb-2">
                We use cookies to enhance your experience. By continuing to
                visit this site you agree to our use of cookies.
              </p>
              <p className="text-xs text-silver_c">
                You can manage your preferences in our{" "}
                <a href="/cookie-policy" className="underline hover:text-darkb">
                  Cookie Policy
                </a>
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Button
                variant="outline"
                className="flex-1 md:flex-none border-silver_c/20 hover:bg-black hover:text-cream"
                onClick={handleDecline}
              >
                Decline
              </Button>
              <Button
                className="flex-1 md:flex-none bg-silver_c text-black hover:bg-black hover:text-cream"
                onClick={handleAccept}
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CookieConsent;
