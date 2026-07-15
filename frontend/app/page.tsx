// app/page.tsx — Home page.
// Server component: fetches data at request time, passes to client components.

import { Suspense } from "react";
import { getFeaturedProjects, getAllProjects, getStats, getContactInfo } from "@/lib/api";
import HomeClient from "@/components/HomeClient";

// Default stats for build time
const DEFAULT_STATS = { total_views: 10_000_000, total_subscribers: 5_000_000, total_likes: 8_000_000 };
const DEFAULT_CONTACT = {
  whatsapp_number: "918660976964",
  whatsapp_url: "https://wa.me/918660976964",
  email: "akshay@youremail.com",
  instagram_handle: "@akshay.vastrad",
  instagram_url: "https://instagram.com/akshay.vastrad",
};

export default async function HomePage() {
  const [featured, allProjects, stats, contact] = await Promise.all([
    getFeaturedProjects().catch(() => []),
    getAllProjects().catch(() => []),
    getStats().catch(() => DEFAULT_STATS),
    getContactInfo().catch(() => DEFAULT_CONTACT),
  ]);

  return (
    <HomeClient
      featured={featured ?? []}
      allProjects={allProjects ?? []}
      stats={stats ?? DEFAULT_STATS}
      contact={contact ?? DEFAULT_CONTACT}
    />
  );
}
