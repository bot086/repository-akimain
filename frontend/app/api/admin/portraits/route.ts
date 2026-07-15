import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readDB, writeDB } from "@/lib/db";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// GET /api/admin/portraits — list (for admin dashboard refresh)
export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const db = readDB();
  return NextResponse.json(db.portraits);
}

// POST /api/admin/portraits — upload a portrait photo
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const altText = (formData.get("alt_text") as string) || null;
  const displayOrder = parseInt(formData.get("display_order") as string || "0", 10);

  if (!file) return NextResponse.json({ detail: "file required" }, { status: 400 });

  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `portrait_${randomUUID().replace(/-/g, "")}.${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filepath, buffer);

  const db = readDB();
  const portrait = {
    id: randomUUID(),
    url: `/uploads/${filename}`,
    alt_text: altText,
    display_order: displayOrder,
    created_at: new Date().toISOString(),
  };

  db.portraits.push(portrait);
  db.portraits.sort((a, b) => a.display_order - b.display_order);
  writeDB(db);

  return NextResponse.json(portrait, { status: 201 });
}
