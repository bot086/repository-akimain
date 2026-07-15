import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readDB, writeDB } from "@/lib/db";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

function getYouTubeId(url: string): string | null {
  for (const pattern of ["v=", "youtu.be/", "embed/"]) {
    if (url.includes(pattern)) {
      const part = url.split(pattern).pop() || "";
      return part.split("&")[0].split("?")[0] || null;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const formData = await req.formData();
  const youtubeUrl = (formData.get("youtube_url") as string)?.trim();
  const projectId = formData.get("project_id") as string;
  const altText = (formData.get("alt_text") as string) || null;

  if (!youtubeUrl || !projectId) {
    return NextResponse.json({ detail: "youtube_url and project_id required" }, { status: 400 });
  }

  const db = readDB();
  const project = db.projects.find(p => p.id === projectId);
  if (!project) return NextResponse.json({ detail: "Project not found" }, { status: 404 });

  const videoId = getYouTubeId(youtubeUrl);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;

  const mediaItem = {
    id: randomUUID(),
    project_id: projectId,
    media_type: "video" as const,
    url: youtubeUrl,
    thumbnail_url: thumbnailUrl,
    alt_text: altText,
    display_order: project.media.length,
    created_at: new Date().toISOString(),
  };

  project.media.push(mediaItem);
  writeDB(db);

  return NextResponse.json({
    url: youtubeUrl,
    thumbnail_url: thumbnailUrl,
    public_id: videoId || youtubeUrl,
    resource_type: "video",
  }, { status: 201 });
}
