import { NextResponse } from "next/server";
import { getGainers, getLosers, getMostActive } from "@/lib/services/stockService";

export async function GET() {
  try {
    const [gainers, losers, actives] = await Promise.all([
      getGainers(),
      getLosers(),
      getMostActive(),
    ]);
    return NextResponse.json({ gainers, losers, actives });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[API /market]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
