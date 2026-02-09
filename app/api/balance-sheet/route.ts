import { NextRequest, NextResponse } from "next/server";
import { getBalanceSheet } from "@/lib/services/financialService";
import type { FinancialPeriod } from "@/types";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  const period = (req.nextUrl.searchParams.get("period") ?? "annual") as FinancialPeriod;
  const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "5");
  if (!symbol) return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  try {
    const data = await getBalanceSheet(symbol, period, limit);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch balance sheet" }, { status: 500 });
  }
}
