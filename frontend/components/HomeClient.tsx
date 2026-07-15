"use client";
// components/HomeClient.tsx — AK2.0
// Full page composition: Hero → Brand Statement → Signature Films →
//   Stats Bar → Service Pillars → Photo Gallery → Contact

import type { Project, Stats, ContactInfo } from "@/lib/api";
import HeroSection from "./HeroSection";
import BrandStatement from "./BrandStatement";
import SignatureFilms from "./SignatureFilms";
import StatsBar from "./StatsBar";
import ServicePillars from "./ServicePillars";
import MasonryGrid from "./MasonryGrid";
import ContactSection from "./ContactSection";

interface Props {
  featured: Project[];
  allProjects: Project[];
  stats: Stats;
  contact: ContactInfo;
}

export default function HomeClient({ allProjects, contact }: Props) {
  return (
    <main className="bg-cream min-h-screen">
      {/* 1. Luxury hero — name + portrait collage */}
      <HeroSection />

      {/* 2. Cinematic brand statement pull-quote */}
      <BrandStatement />

      {/* 3. 8 signature wedding films — editorial board */}
      <SignatureFilms />

      {/* 4. Animated stats — 40+ / 4 Years / 100% */}
      <StatsBar />

      {/* 5. Three service pillars — Quality · Service · Commitment */}
      <ServicePillars />

      {/* 6. 30-photo masonry archive with lightbox */}
      <MasonryGrid projects={allProjects} />

      {/* 7. Contact — WhatsApp · Email · Instagram */}
      <ContactSection contact={contact} />
    </main>
  );
}
