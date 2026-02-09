import { NextRequest, NextResponse } from "next/server";
import { getHistoricalPrices } from "@/lib/services/stockService";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  const from = req.nextUrl.searchParams.get("from") ?? undefined;
  const to = req.nextUrl.searchParams.get("to") ?? undefined;
  if (!symbol) return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  try {
    const data = await getHistoricalPrices(symbol, from, to);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch historical data" }, { status: 500 });
  }
}
