import { NextRequest, NextResponse } from "next/server";
import { getKeyMetrics } from "@/lib/services/stockService";
import type { FinancialPeriod } from "@/types";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  const period = (req.nextUrl.searchParams.get("period") ?? "annual") as FinancialPeriod;
  const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "5");
  if (!symbol) return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  try {
    const data = await getKeyMetrics(symbol, period, limit);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
}
