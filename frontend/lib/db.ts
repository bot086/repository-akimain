/**
 * lib/db.ts — JSON file-based data store.
 * Reads/writes frontend/data/db.json which is committed to git.
 * In production (Vercel), writes are ephemeral (deploy-only updates).
 * In development (local), writes persist to disk → push to git to publish.
 */
import fs from "fs";
import path from "path";

export interface MediaItem {
  id: string;
  project_id: string;
  media_type: "video" | "photo";
  url: string;
  thumbnail_url: string | null;
  alt_text: string | null;
  display_order: number;
  created_at?: string;
}

export interface Portrait {
  id: string;
  url: string;
  alt_text: string | null;
  display_order: number;
  created_at?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  client_name: string | null;
  release_date: string | null;
  is_featured: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
  media: MediaItem[];
}

export interface Stats {
  id?: number;
  total_views: number;
  total_subscribers: number;
  total_likes: number;
  updated_at?: string;
}

export interface ContactInfo {
  id?: number;
  whatsapp_number: string;
  whatsapp_greeting?: string;
  email: string;
  instagram_handle: string;
  updated_at?: string;
}

export interface DB {
  projects: Project[];
  portraits: Portrait[];
  stats: Stats;
  contact: ContactInfo;
}

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export function readDB(): DB {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw) as DB;
}

export function writeDB(db: DB): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export function getContactUrl(db: DB): { whatsapp_url: string; instagram_url: string } {
  const c = db.contact;
  const greeting = c.whatsapp_greeting || "Hi+Akshay%2C+I+saw+your+portfolio+and+would+love+to+collaborate%21";
  return {
    whatsapp_url: `https://wa.me/${c.whatsapp_number}?text=${greeting}`,
    instagram_url: `https://instagram.com/${c.instagram_handle.replace(/^@/, "")}`,
  };
}
