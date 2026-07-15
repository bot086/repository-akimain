// lib/api.ts — All fetch helpers, now using Next.js internal API routes.
// In development: calls localhost:3000/api/...
// In production (Vercel): same-origin /api/... — no separate backend needed!

// Empty string = relative URL (same origin). Works both locally and on Vercel.
export const API = "";

export interface MediaItem {
  id: string;
  project_id: string;
  media_type: "video" | "photo";
  url: string;
  thumbnail_url: string | null;
  alt_text: string | null;
  display_order: number;
}

export interface Portrait {
  id: string;
  url: string;
  alt_text: string | null;
  display_order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  client_name: string | null;
  release_date: string | null;
  is_featured: boolean;
  display_order: number;
  media: MediaItem[];
}

export interface Stats {
  total_views: number;
  total_subscribers: number;
  total_likes: number;
}

export interface ContactInfo {
  whatsapp_number: string;
  whatsapp_url: string;
  email: string;
  instagram_handle: string;
  instagram_url: string;
}

async function fetcher<T>(path: string): Promise<T> {
  const base = typeof window === "undefined"
    ? (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
    : "";
  const res = await fetch(`${base}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error: ${res.status} ${path}`);
  return res.json();
}

export const getFeaturedProjects = () => fetcher<Project[]>("/api/projects/featured");
export const getAllProjects      = () => fetcher<Project[]>("/api/projects");
export const getProject         = (id: string) => fetcher<Project>(`/api/projects/${id}`);
export const getStats           = () => fetcher<Stats>("/api/stats");
export const getContactInfo     = () => fetcher<ContactInfo>("/api/contact");
export const getPortraits       = () => fetcher<Portrait[]>("/api/portraits");

/**
 * Photos in /uploads/ are served as static assets by Next.js/Vercel CDN.
 * YouTube thumbnails and external URLs pass through as-is.
 */
export function resolveMediaUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  // /uploads/... is served from public/ folder — same origin
  return url;
}
