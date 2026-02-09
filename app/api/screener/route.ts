import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/api";

export async function GET(req: NextRequest) {
  const params: Record<string, string> = {};

  const marketCapMoreThan = req.nextUrl.searchParams.get("marketCapMoreThan");
  const marketCapLowerThan = req.nextUrl.searchParams.get("marketCapLowerThan");
  const priceMoreThan = req.nextUrl.searchParams.get("priceMoreThan");
  const priceLowerThan = req.nextUrl.searchParams.get("priceLowerThan");
  const volumeMoreThan = req.nextUrl.searchParams.get("volumeMoreThan");
  const dividendMoreThan = req.nextUrl.searchParams.get("dividendMoreThan");
  const sector = req.nextUrl.searchParams.get("sector");
  const exchange = req.nextUrl.searchParams.get("exchange");
  const limit = req.nextUrl.searchParams.get("limit") ?? "50";

  if (marketCapMoreThan) params.marketCapMoreThan = marketCapMoreThan;
  if (marketCapLowerThan) params.marketCapLowerThan = marketCapLowerThan;
  if (priceMoreThan) params.priceMoreThan = priceMoreThan;
  if (priceLowerThan) params.priceLowerThan = priceLowerThan;
  if (volumeMoreThan) params.volumeMoreThan = volumeMoreThan;
  if (dividendMoreThan) params.dividendMoreThan = dividendMoreThan;
  if (sector) params.sector = sector;
  if (exchange) params.exchange = exchange;
  params.limit = limit;

  try {
    // Try the stable company-screener endpoint first
    const { data } = await api.get("/company-screener", { params });
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (err: unknown) {
    // If company-screener is not available (paid plan), return helpful error
    const message = err instanceof Error ? err.message : "Unknown error";
    const isRestricted =
      typeof message === "string" &&
      (message.includes("403") || message.includes("Restricted") || message.includes("subscription"));

    if (isRestricted) {
      return NextResponse.json(
        { error: "The stock screener requires a paid FMP plan. You can still search for individual stocks using the search bar." },
        { status: 403 }
      );
    }

    console.error("[API /screener]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
