"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { UserButton } from "@clerk/nextjs";
import { Settings, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="w-full h-20 bg-cream shadow-sm">
      <div className="flex items-center justify-between px-6 h-full max-w-7xl mx-auto">
        {/* Left section - Logo and nav links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            {/* Use Logo directly as a component */}
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
              href="/journal"
              className="text-lg font-medium text-darkb hover:text-silver_d transition-colors"
            >
              Journal
            </Link>
            <Link
              href="/wins"
              className="text-lg font-medium text-darkb hover:text-silver_d transition-colors"
            >
              Wins
            </Link>
          </div>
        </div>

        {/* Right section - Settings and Profile */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/settings"
            className="p-2 text-darkb hover:text-silver_d transition-colors"
          >
            <Settings className="h-6 w-6" />
          </Link>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
            }}
          />
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
              href="/journal"
              className="text-lg font-medium text-darkb hover:text-silver_d transition-colors"
              onClick={toggleMenu}
            >
              Journal
            </Link>
            <Link
              href="/wins"
              className="text-lg font-medium text-darkb hover:text-silver_d transition-colors"
              onClick={toggleMenu}
            >
              Wins
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-2 text-lg font-medium text-darkb hover:text-silver_d transition-colors"
              onClick={toggleMenu}
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
            <div className="pt-2">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10",
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
