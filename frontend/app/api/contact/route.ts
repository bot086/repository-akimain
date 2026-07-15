import { NextResponse } from "next/server";
import { readDB, getContactUrl } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = readDB();
  const urls = getContactUrl(db);
  return NextResponse.json({ ...db.contact, ...urls });
}
