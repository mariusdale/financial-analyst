import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/services/stockService";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  if (!symbol) return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  try {
    const data = await getProfile(symbol);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}
