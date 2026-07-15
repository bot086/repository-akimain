import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readDB, writeDB } from "@/lib/db";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// DELETE /api/admin/media/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const db = readDB();
  let deleted = false;

  for (const project of db.projects) {
    const media = project.media.find(m => m.id === params.id);
    if (media) {
      // Delete local file if it's an upload
      if (media.url.startsWith("/uploads/")) {
        const filePath = path.join(process.cwd(), "public", media.url);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      project.media = project.media.filter(m => m.id !== params.id);
      deleted = true;
      break;
    }
  }

  if (!deleted) return NextResponse.json({ detail: "Not found" }, { status: 404 });
  writeDB(db);
  return NextResponse.json({ ok: true });
}

// PUT /api/admin/media/[id] — update alt_text
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const body = await req.json();
  const db = readDB();

  for (const project of db.projects) {
    const media = project.media.find(m => m.id === params.id);
    if (media) {
      if (body.alt_text !== undefined) media.alt_text = body.alt_text;
      writeDB(db);
      return NextResponse.json(media);
    }
  }

  return NextResponse.json({ detail: "Not found" }, { status: 404 });
}
