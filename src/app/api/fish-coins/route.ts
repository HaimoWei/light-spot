import { NextResponse } from "next/server";
import { getFishCoinsState, incrementFishCoins } from "@/lib/visits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const total = await incrementFishCoins();
  return NextResponse.json({ total }, { headers: { "cache-control": "no-store" } });
}

export async function GET() {
  const state = await getFishCoinsState();
  return NextResponse.json(state, { headers: { "cache-control": "no-store" } });
}

