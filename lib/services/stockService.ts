import api from "@/lib/api";
import type {
  StockProfile,
  StockQuote,
  SearchResult,
  HistoricalPrice,
  KeyMetrics,
  MarketMover,
} from "@/types";

export async function searchStocks(query: string): Promise<SearchResult[]> {
  // Use both search-symbol and search-name, merge and dedupe
  const [symbolRes, nameRes] = await Promise.allSettled([
    api.get("/search-symbol", { params: { query, limit: 10 } }),
    api.get("/search-name", { params: { query, limit: 10 } }),
  ]);

  const symbolResults = symbolRes.status === "fulfilled" ? symbolRes.value.data : [];
  const nameResults = nameRes.status === "fulfilled" ? nameRes.value.data : [];

  // Merge and dedupe by symbol
  const seen = new Set<string>();
  const merged: SearchResult[] = [];
  for (const item of [...symbolResults, ...nameResults]) {
    if (!seen.has(item.symbol)) {
      seen.add(item.symbol);
      merged.push({
        symbol: item.symbol,
        name: item.name,
        currency: item.currency || "USD",
        stockExchange: item.exchangeFullName || item.exchange || "",
        exchangeShortName: item.exchange || "",
      });
    }
  }
  return merged.slice(0, 10);
}

export async function getProfile(symbol: string): Promise<StockProfile> {
  const { data } = await api.get("/profile", { params: { symbol } });
  const raw = Array.isArray(data) ? data[0] : data;

  // Map stable API fields to our interface
  return {
    symbol: raw.symbol,
    companyName: raw.companyName,
    price: raw.price,
    changes: raw.change || 0,
    changesPercentage: raw.changePercentage || 0,
    currency: raw.currency || "USD",
    exchange: raw.exchange || "",
    exchangeShortName: raw.exchange || "",
    industry: raw.industry || "",
    sector: raw.sector || "",
    country: raw.country || "",
    mktCap: raw.marketCap || 0,
    description: raw.description || "",
    ceo: raw.ceo || "",
    fullTimeEmployees: raw.fullTimeEmployees?.toString() || "",
    image: raw.image || "",
    ipoDate: raw.ipoDate || "",
    website: raw.website || "",
    beta: raw.beta || 0,
    volAvg: raw.averageVolume || 0,
    lastDiv: raw.lastDividend || 0,
    range: raw.range || "",
    dcfDiff: raw.dcfDiff || 0,
    dcf: raw.dcf || 0,
    isEtf: raw.isEtf || false,
    isActivelyTrading: raw.isActivelyTrading ?? true,
  };
}

export async function getQuote(symbol: string): Promise<StockQuote> {
  const { data } = await api.get("/quote", { params: { symbol } });
  const raw = Array.isArray(data) ? data[0] : data;

  return {
    symbol: raw.symbol,
    name: raw.name || "",
    price: raw.price,
    changesPercentage: raw.changePercentage ?? raw.changesPercentage ?? 0,
    change: raw.change || 0,
    dayLow: raw.dayLow || 0,
    dayHigh: raw.dayHigh || 0,
    yearHigh: raw.yearHigh || 0,
    yearLow: raw.yearLow || 0,
    marketCap: raw.marketCap || 0,
    priceAvg50: raw.priceAvg50 || 0,
    priceAvg200: raw.priceAvg200 || 0,
    exchange: raw.exchange || "",
    volume: raw.volume || 0,
    avgVolume: raw.avgVolume || raw.averageVolume || 0,
    open: raw.open || 0,
    previousClose: raw.previousClose || 0,
    eps: raw.eps || 0,
    pe: raw.pe || 0,
    earningsAnnouncement: raw.earningsAnnouncement || "",
    sharesOutstanding: raw.sharesOutstanding || 0,
    timestamp: raw.timestamp || 0,
  };
}

export async function getBatchQuotes(symbols: string[]): Promise<StockQuote[]> {
  // Stable API: fetch quotes individually in parallel
  const results = await Promise.allSettled(
    symbols.map((s) => api.get("/quote", { params: { symbol: s } }))
  );

  return results
    .filter((r) => r.status === "fulfilled")
    .map((r) => {
      const fulfilled = r as PromiseFulfilledResult<{ data: unknown }>;
      const raw: Record<string, unknown> = Array.isArray(fulfilled.value.data) ? fulfilled.value.data[0] : fulfilled.value.data as Record<string, unknown>;
      return {
        symbol: raw.symbol,
        name: raw.name || "",
        price: raw.price,
        changesPercentage: raw.changePercentage ?? raw.changesPercentage ?? 0,
        change: raw.change || 0,
        dayLow: raw.dayLow || 0,
        dayHigh: raw.dayHigh || 0,
        yearHigh: raw.yearHigh || 0,
        yearLow: raw.yearLow || 0,
        marketCap: raw.marketCap || 0,
        priceAvg50: raw.priceAvg50 || 0,
        priceAvg200: raw.priceAvg200 || 0,
        exchange: raw.exchange || "",
        volume: raw.volume || 0,
        avgVolume: raw.avgVolume || raw.averageVolume || 0,
        open: raw.open || 0,
        previousClose: raw.previousClose || 0,
        eps: raw.eps || 0,
        pe: raw.pe || 0,
        earningsAnnouncement: raw.earningsAnnouncement || "",
        sharesOutstanding: raw.sharesOutstanding || 0,
        timestamp: raw.timestamp || 0,
      } as StockQuote;
    })
    .filter((q) => q.symbol);
}

export async function getHistoricalPrices(
  symbol: string,
  from?: string,
  to?: string
): Promise<HistoricalPrice[]> {
  const { data } = await api.get("/historical-price-eod/full", {
    params: { symbol, from, to },
  });
  // Stable API returns array directly
  const prices = Array.isArray(data) ? data : data?.historical || [];
  return prices.map((p: Record<string, unknown>) => ({
    date: p.date as string,
    open: p.open as number,
    high: p.high as number,
    low: p.low as number,
    close: p.close as number,
    adjClose: (p.adjClose ?? p.close) as number,
    volume: p.volume as number,
    changePercent: (p.changePercent ?? 0) as number,
  }));
}

export async function getKeyMetrics(
  symbol: string,
  period: "annual" | "quarter" = "annual",
  limit = 5
): Promise<KeyMetrics[]> {
  const { data } = await api.get("/key-metrics", {
    params: { symbol, period, limit },
  });
  return data;
}

export async function getGainers(): Promise<MarketMover[]> {
  const { data } = await api.get("/biggest-gainers");
  return (data || []).slice(0, 10).map(mapMover);
}

export async function getLosers(): Promise<MarketMover[]> {
  const { data } = await api.get("/biggest-losers");
  return (data || []).slice(0, 10).map(mapMover);
}

export async function getMostActive(): Promise<MarketMover[]> {
  const { data } = await api.get("/most-actives");
  return (data || []).slice(0, 10).map(mapMover);
}

function mapMover(raw: Record<string, unknown>): MarketMover {
  return {
    symbol: raw.symbol as string,
    name: raw.name as string,
    change: (raw.change as number) || 0,
    price: (raw.price as number) || 0,
    changesPercentage: (raw.changesPercentage as number) || 0,
  };
}
