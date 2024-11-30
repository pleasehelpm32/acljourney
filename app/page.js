"use client";
import React from "react";
import MediumArticlesCarousel from "@/components/MediumArticlesCarousel";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-darkb">
          ACL Journey
        </h1>
        <p className="text-xl text-silver_c max-w-2xl mx-auto">
          Your companion through ACL recovery. Track progress, share
          experiences, and stay motivated on your path to healing.
        </p>
        {/* Mobile: Stack buttons vertically */}
        <div className="flex flex-col md:hidden space-y-4">
          <Link href="/journal" className="w-full">
            <Button className="w-full bg-silver_c text-black hover:bg-black hover:text-cream transition-all py-6 px-8">
              Start Your Journey
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard" className="w-full">
            <Button className="w-full bg-darkb text-cream hover:bg-black hover:text-cream transition-all py-6 px-8">
              View Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        {/* Desktop: Single button */}
        <div className="hidden md:flex justify-center gap-4">
          <Link href="/journal">
            <Button className="bg-silver_c text-black hover:bg-black hover:text-cream transition-all py-6 px-8">
              Start Your Journey
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Story Section */}
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-darkb mb-4">
          My Story
        </h2>
        <div className="space-y-4">
          <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-md mb-4">
            <video controls className="w-full h-full object-cover" playsInline>
              <source src="/videos/acltearbasketball.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Video description */}
          <p className="text-sm text-silver_c text-center italic">
            How I Tore My ACL - Coming down from a rebound during a men's league
            basketball game
          </p>
        </div>
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-darkb">
                Sup, I'm Josh.
              </h3>
              <p className="text-black/80">
                I really didn’t anticipate tearing my ACL, but I guess worse
                things could have happened. To this day, I’m still shocked. I
                play basketball casually, hooping a few times a week alongside
                lifting weights. I’d heard of ACL tears, but mostly in
                professional athletes, so I never thought it could happen to me.
                I’ve had my share of ankle sprains and minor injuries, but
                tearing my ACL felt like something out of my league. So, when I
                heard a pop as I came down from a rebound, I honestly didn’t
                think much of it. But boy, was I wrong.
              </p>

              <p className="text-black/80">
                At first, I was in denial—hoping for the best-case scenario. But
                after seeing my physio and getting the scans, there was no
                denying it anymore. I kept asking, “Why me?” It didn’t make
                sense—I was just playing for fun and I took care of my body.
                Eventually, though, I accepted it and started planning for
                surgery. A part of me considered not going through with it, but
                the uncertainty of that path, along with stories of people
                worsening their situation by avoiding surgery, pushed me toward
                getting it done.
              </p>
              <p className="text-black/80">
                As I write this, I’m about 70 days post-surgery and feeling
                pretty great (for now)! Looking back, I’m glad I delayed surgery
                until after the summer. It gave me time to focus on prehab,
                which I now recommend to everyone. Prehab was a huge factor in
                my early success with physio. Plus, it allowed me to enjoy life
                a bit—like experiencing surfing with one ACL (something I hope
                never to do again).
              </p>
              <p className="text-black/80">
                Two things have really helped me through this process. The first
                was mentally preparing myself for the long, 365-day journey
                ahead. I know some people are back to sports in 9 months, but
                why rush? Accepting a longer timeline has helped me manage
                expectations, avoid disappointment, and give my body the time it
                needs to truly heal. The second thing has been journaling,
                something I only started after the injury. There are so many
                emotions that come with this journey. Some days, I’ve found
                myself crying in bed, and other days, I’m fired up about an
                exercise I crushed at the gym. It’s a rollercoaster, and
                journaling has been my anchor—an outlet for all those thoughts
                and emotions that no one else can fully understand.
              </p>
              <p className="text-black/80">
                People often think that after a few months of recovery, you’re
                back to normal. They haven’t been through it, so they don’t
                know—and that’s okay. But journaling has been a way for me to be
                truly honest with myself. It’s allowed me to track my progress,
                re-read my thoughts on both good and bad days, and keep
                everything in perspective. This journey, while long, is filled
                with small wins and valuable moments, and focusing on those has
                made me a more grateful person.
              </p>
              <p className="text-black/80 font-medium">
                That’s why I created this site—a place for you to journal and
                let your emotions out. During my time off post-surgery, I dove
                deeper into coding, and this site became my baby. It’s far from
                perfect, but just like the ACL journey, I’m taking it one day at
                a time, and I know it’ll get better. I hope this site helps you
                through your journey, and I truly wish you the best. Godspeed,
                and good luck to everyone on the journey to recovery!
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <Link href="/dashboard">
                <Button className="bg-silver_c text-black hover:bg-black hover:text-cream transition-all py-6 px-8">
                  View Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Articles Section */}
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-darkb">
          Latest Articles
        </h2>
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <p className="font-medium text-black/80">
            I like to recap my weeks too, check out the articles!
          </p>
          <MediumArticlesCarousel />
        </div>
      </div>
    </div>
  );
}
