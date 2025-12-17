import { NextResponse } from "next/server";
import { getVisitState, incrementVisitCount } from "@/lib/visits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const total = await incrementVisitCount();
  return NextResponse.json({ total }, { headers: { "cache-control": "no-store" } });
}

export async function GET(request: Request) {
  const state = await getVisitState();
  return NextResponse.json(state, { headers: { "cache-control": "no-store" } });
}
