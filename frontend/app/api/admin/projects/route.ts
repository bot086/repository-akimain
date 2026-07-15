import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readDB, writeDB } from "@/lib/db";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

// POST /api/admin/projects — create a new project
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const body = await req.json();
  const db = readDB();

  const project = {
    id: randomUUID(),
    title: body.title,
    description: body.description || null,
    client_name: body.client_name || null,
    release_date: body.release_date || null,
    is_featured: body.is_featured ?? false,
    display_order: body.display_order ?? db.projects.length,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    media: [],
  };

  db.projects.push(project);
  writeDB(db);

  return NextResponse.json(project, { status: 201 });
}
