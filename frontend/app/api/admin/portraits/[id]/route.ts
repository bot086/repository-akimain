import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readDB, writeDB } from "@/lib/db";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// DELETE /api/admin/portraits/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const db = readDB();
  const portrait = db.portraits.find(p => p.id === params.id);
  if (!portrait) return NextResponse.json({ detail: "Not found" }, { status: 404 });

  // Delete local file
  if (portrait.url.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", portrait.url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  db.portraits = db.portraits.filter(p => p.id !== params.id);
  writeDB(db);
  return NextResponse.json({ ok: true });
}
