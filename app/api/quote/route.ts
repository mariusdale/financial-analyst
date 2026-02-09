import { NextRequest, NextResponse } from "next/server";
import { getQuote, getBatchQuotes } from "@/lib/services/stockService";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  const symbols = req.nextUrl.searchParams.get("symbols");

  try {
    if (symbols) {
      const data = await getBatchQuotes(symbols.split(","));
      return NextResponse.json(data);
    }
    if (symbol) {
      const data = await getQuote(symbol);
      return NextResponse.json(data);
    }
    return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[API /quote]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
