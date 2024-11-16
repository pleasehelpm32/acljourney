"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserButton, SignInButton, useAuth } from "@clerk/nextjs";
import { Settings, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const AuthButton = () => {
    if (isSignedIn) {
      return (
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-10 w-10",
            },
          }}
        />
      );
    }

    return (
      <SignInButton mode="modal">
        <button className="px-4 py-2 rounded-lg bg-silver_c hover:text-cream hover:bg-black text-black transition-colors">
          Sign In
        </button>
      </SignInButton>
    );
  };

  return (
    <nav className="w-full h-20 bg-cream shadow-sm">
      <div className="flex items-center justify-between px-6 h-full max-w-7xl mx-auto">
        {/* Left section - Logo and nav links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/assetss/acllogocrop.svg"
              alt="ACL Journey Logo"
              width={80}
              height={80}
              className="h-20 w-auto"
              priority
            />
            <span className="sr-only">ACL Journey</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-lg font-medium text-darkb hover:text-silver_d transition-colors"
            >
              Home
            </Link>
            {isSignedIn && (
              <Link
                href="/journal"
                className="text-lg font-medium text-darkb hover:text-silver_d transition-colors"
              >
                Journal
              </Link>
            )}
          </div>
        </div>

        {/* Right section - Settings and Profile */}
        <div className="hidden md:flex items-center gap-4">
          {isSignedIn && (
            <Link
              href="/settings"
              className="p-2 text-darkb hover:text-silver_d transition-colors"
            >
              <Settings className="h-6 w-6" />
            </Link>
          )}
          <AuthButton />
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="p-2 text-darkb hover:text-silver_d transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white shadow-lg z-50">
          <div className="flex flex-col p-4 space-y-4">
            <Link
              href="/"
              className="text-lg font-medium text-darkb hover:text-silver_d transition-colors"
              onClick={toggleMenu}
            >
              Home
            </Link>
            {isSignedIn && (
              <>
                <Link
                  href="/journal"
                  className="text-lg font-medium text-darkb hover:text-silver_d transition-colors"
                  onClick={toggleMenu}
                >
                  Journal
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 text-lg font-medium text-darkb hover:text-silver_d transition-colors"
                  onClick={toggleMenu}
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
              </>
            )}
            <div className="pt-2">
              <AuthButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
