import { NextRequest, NextResponse } from "next/server";
import { getHistoricalDCFInputs } from "@/lib/services/valuationService";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  if (!symbol) return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  try {
    const data = await getHistoricalDCFInputs(symbol);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch DCF inputs" }, { status: 500 });
  }
}
