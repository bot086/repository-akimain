"use client";
// components/HomeClient.tsx
// Main page shell — assembles all sections. No loading screen.

import type { Project, Stats, ContactInfo } from "@/lib/api";
import HeroSection from "./HeroSection";
import EditorialSpotlight from "./EditorialSpotlight";
import MasonryGrid from "./MasonryGrid";
import ProjectList from "./ProjectList";
import ContactSection from "./ContactSection";

interface Props {
  featured: Project[];
  allProjects: Project[];
  stats: Stats;
  contact: ContactInfo;
}

export default function HomeClient({ featured, allProjects, contact }: Props) {
  return (
    <main className="bg-cream min-h-screen">
      {/* 1. Luxury cream hero */}
      <HeroSection />

      {/* 2. Full-screen parallax editorial spotlight (featured projects) */}
      <EditorialSpotlight projects={featured} />

      {/* 3. Masonry grid — all project media */}
      <MasonryGrid projects={allProjects} />

      {/* 4. Project accordion index */}
      <ProjectList projects={allProjects} />

      {/* 5. Contact footer */}
      <ContactSection contact={contact} />
    </main>
  );
}
