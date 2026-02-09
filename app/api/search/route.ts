import { NextRequest, NextResponse } from "next/server";
import { searchStocks } from "@/lib/services/stockService";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  if (!query || query.length < 1) {
    return NextResponse.json([]);
  }
  try {
    const results = await searchStocks(query);
    return NextResponse.json(results);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[API /search]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
