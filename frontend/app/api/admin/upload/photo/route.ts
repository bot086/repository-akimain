import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readDB, writeDB } from "@/lib/db";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const projectId = formData.get("project_id") as string;
  const altText = (formData.get("alt_text") as string) || null;

  if (!file || !projectId) {
    return NextResponse.json({ detail: "file and project_id required" }, { status: 400 });
  }

  const db = readDB();
  const project = db.projects.find(p => p.id === projectId);
  if (!project) return NextResponse.json({ detail: "Project not found" }, { status: 404 });

  // Save file to public/uploads/
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${randomUUID().replace(/-/g, "")}.${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filepath, buffer);

  const url = `/uploads/${filename}`;
  const mediaItem = {
    id: randomUUID(),
    project_id: projectId,
    media_type: "photo" as const,
    url,
    thumbnail_url: url,
    alt_text: altText,
    display_order: project.media.length,
    created_at: new Date().toISOString(),
  };

  project.media.push(mediaItem);
  writeDB(db);

  return NextResponse.json({ url, thumbnail_url: url, public_id: filename, resource_type: "image" }, { status: 201 });
}
