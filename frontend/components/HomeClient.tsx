"use client";
// components/HomeClient.tsx — AK2.0
// Full page composition. FilmReel appears ABOVE and BELOW the gallery.

import type { Project, Stats, ContactInfo } from "@/lib/api";
import HeroSection from "./HeroSection";
import BrandStatement from "./BrandStatement";
import SignatureFilms from "./SignatureFilms";
import StatsBar from "./StatsBar";
import ServicePillars from "./ServicePillars";
import MasonryGrid from "./MasonryGrid";
import FilmReel from "./FilmReel";
import ClientTestimonials from "./ClientTestimonials";
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
      {/* 1. Hero — name + role tags + portrait collage */}
      <HeroSection />

      {/* 2. Brand statement */}
      <BrandStatement />

      {/* 3. 10 Signature Films */}
      <SignatureFilms />

      {/* 4. Animated stats */}
      <StatsBar />

      {/* 5. Service Pillars */}
      <ServicePillars />

      {/* 5b. Client Testimonials — scrolling marquee panel */}
      <ClientTestimonials />

      {/* 6b. Photo Gallery — masonry with lightbox */}
      <MasonryGrid projects={allProjects} />

      {/* 6c. Film Reel — BELOW gallery */}
      <FilmReel projects={allProjects} />

      {/* 7. Contact */}
      <ContactSection contact={contact} />
    </main>
  );
}
