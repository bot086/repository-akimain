// lib/api.ts — All fetch helpers for the FastAPI backend.

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface MediaItem {
  id: string;
  project_id: string;
  media_type: "video" | "photo";
  url: string;
  thumbnail_url: string | null;
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
  const res = await fetch(`${API}/api/v1${path}`, {
    next: { revalidate: 60 }, // ISR: revalidate every 60s
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${path}`);
  return res.json();
}

export const getFeaturedProjects = () =>
  fetcher<Project[]>("/projects/featured");

export const getAllProjects = () =>
  fetcher<Project[]>("/projects");

export const getProject = (id: string) =>
  fetcher<Project>(`/projects/${id}`);

export const getStats = () =>
  fetcher<Stats>("/stats");

export const getContactInfo = () =>
  fetcher<ContactInfo>("/contact");
