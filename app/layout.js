import localFont from "next/font/local";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "ACL Journey",
  description:
    "Recovery tool to help you after ACL reconstruction surgery. A daily journal and win tracker to help you monitor progress and stay on top of the recovery process.",
  icons: {
    icon: [
      { url: "/icon_crop/favicon.ico" },
      {
        url: "/icon_crop/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/icon_crop/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/icon_crop/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        url: "/icon_crop/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/icon_crop/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased `}
        >
          <Navbar />
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
