import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readDB, writeDB } from "@/lib/db";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// DELETE /api/admin/projects/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const db = readDB();
  const project = db.projects.find(p => p.id === params.id);
  if (!project) return NextResponse.json({ detail: "Not found" }, { status: 404 });

  // Delete associated local media files
  for (const m of project.media ?? []) {
    if (m.url.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", m.url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  }

  db.projects = db.projects.filter(p => p.id !== params.id);
  writeDB(db);

  return NextResponse.json({ ok: true });
}
