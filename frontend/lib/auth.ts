import { NextRequest, NextResponse } from "next/server";

export function getAdminSecret(): string {
  return process.env.ADMIN_SECRET || "changeme";
}

export function requireAdmin(req: NextRequest): NextResponse | null {
  const auth = req.headers.get("authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "").trim();
  if (token !== getAdminSecret()) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }
  return null; // means OK
}
