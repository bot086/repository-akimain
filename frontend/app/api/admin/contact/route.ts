import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const db = readDB();

    // Merge only the fields that were provided
    if (body.email !== undefined) db.contact.email = body.email;
    if (body.instagram_handle !== undefined) db.contact.instagram_handle = body.instagram_handle;
    if (body.whatsapp_number !== undefined) db.contact.whatsapp_number = body.whatsapp_number;
    if (body.whatsapp_greeting !== undefined) db.contact.whatsapp_greeting = body.whatsapp_greeting;
    db.contact.updated_at = new Date().toISOString();

    writeDB(db);
    return NextResponse.json({ ok: true, contact: db.contact });
  } catch (e) {
    return NextResponse.json({ detail: "Failed to update contact" }, { status: 500 });
  }
}
