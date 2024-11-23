import localFont from "next/font/local";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import CookieConsent from "@/components/CookieConsent";
import Footer from "@/components/Footer";
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
  metadataBase: new URL("https://www.acljourney.com"),
  title: {
    default: "ACL Journey - ACL Recovery Tracking & Support",
    template: "%s | ACL Journey",
  },
  description:
    "Recovery tool to help you after ACL reconstruction surgery. Track your daily progress, journal your rehabilitation journey, and connect with others recovering from ACL surgery.",
  keywords: [
    "ACL recovery",
    "ACL surgery",
    "ACL rehabilitation",
    "ACL journal",
    "ACL tear",
    "knee surgery recovery",
    "ACL reconstruction",
    "ACL tracking",
    "rehabilitation journal",
    "recovery progress",
  ],
  authors: [{ name: "Josh" }],
  creator: "Josh",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.acljourney.com",
    siteName: "ACL Journey",
    title: "ACL Journey - Track Your Recovery Progress",
    description:
      "Comprehensive ACL recovery tracking tool with daily journaling, progress monitoring, and rehabilitation support.",
    images: [
      {
        url: "/icon_crop/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "ACL Journey Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ACL Journey - Recovery Tracking & Support",
    description:
      "Track your ACL recovery journey with our specialized tools and support system.",
    images: ["/icon_crop/android-chrome-512x512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    google: "0jmAbgeSViPTuokI1N94E5UkXu-x9gToZW-W0yrAzXM",
  },
};
export default function RootLayout({ children }) {
  return (
    <ClerkProvider dynamic>
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* Google Tag Manager */}
          <Script
            id="google-tag-manager"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
              `,
            }}
          />

          {/* Google Analytics */}
          <Script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `,
            }}
          />

          {/* Microsoft Clarity */}
          <Script
            id="microsoft-clarity"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
              `,
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "ACL Journey",
                url: "https://www.acljourney.com",
                description: "ACL recovery tracking and support platform",
                author: {
                  "@type": "Person",
                  name: "Josh",
                },
                keywords: "ACL recovery, ACL surgery, rehabilitation",
              }),
            }}
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* Google Tag Manager (NoScript) */}
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
          <Navbar />
          {children}
          <Toaster />
          <Analytics />
          <Footer />
          <CookieConsent />
        </body>
      </html>
    </ClerkProvider>
  );
}
