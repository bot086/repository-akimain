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

      {/* 5. Photo Gallery — masonry with lightbox (moved up before Services) */}
      <MasonryGrid projects={allProjects} />

      {/* 5b. Film Reel scroll — horizontal video strip */}
      <FilmReel projects={allProjects} />

      {/* 6. Service Pillars — Why Choose Us */}
      <ServicePillars />

      {/* 6b. Client Testimonials */}
      <ClientTestimonials />

      {/* 7. Contact */}
      <ContactSection contact={contact} />
    </main>
  );
}
