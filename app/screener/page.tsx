"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useScreener } from "@/lib/hooks";
import type { ScreenerFilters } from "@/lib/hooks";
import { formatCurrency, formatCompactNumber } from "@/lib/formatters";
import { Filter, Search, ExternalLink } from "lucide-react";

const SECTORS = [
  "Technology",
  "Healthcare",
  "Financial Services",
  "Consumer Cyclical",
  "Consumer Defensive",
  "Industrials",
  "Energy",
  "Real Estate",
  "Utilities",
  "Basic Materials",
  "Communication Services",
];

const MARKET_CAP_PRESETS = [
  { label: "Any", min: "", max: "" },
  { label: "Mega (>$200B)", min: "200000000000", max: "" },
  { label: "Large ($10B-$200B)", min: "10000000000", max: "200000000000" },
  { label: "Mid ($2B-$10B)", min: "2000000000", max: "10000000000" },
  { label: "Small ($300M-$2B)", min: "300000000", max: "2000000000" },
  { label: "Micro (<$300M)", min: "", max: "300000000" },
];

export default function ScreenerPage() {
  const [filters, setFilters] = useState<ScreenerFilters>({
    exchange: "NYSE,NASDAQ",
    limit: "50",
  });
  const [appliedFilters, setAppliedFilters] = useState<ScreenerFilters>(filters);
  const [hasSearched, setHasSearched] = useState(false);

  const { data: results = [], isLoading, error } = useScreener(appliedFilters, hasSearched);

  function handleSearch() {
    setAppliedFilters({ ...filters });
    setHasSearched(true);
  }

  function handleMarketCapPreset(index: string) {
    const preset = MARKET_CAP_PRESETS[parseInt(index)];
    if (!preset) return;
    setFilters((f) => ({
      ...f,
      marketCapMoreThan: preset.min,
      marketCapLowerThan: preset.max,
    }));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Stock Screener</h1>
        <p className="text-muted-foreground text-sm">
          Filter stocks by fundamental criteria to find investment opportunities.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Sector</label>
              <Select
                value={filters.sector || "all"}
                onValueChange={(v) => setFilters((f) => ({ ...f, sector: v === "all" ? "" : v }))}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Any sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Sector</SelectItem>
                  {SECTORS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Market Cap</label>
              <Select onValueChange={handleMarketCapPreset}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  {MARKET_CAP_PRESETS.map((p, i) => (
                    <SelectItem key={p.label} value={String(i)}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Min Price ($)</label>
              <Input
                type="number"
                placeholder="0"
                value={filters.priceMoreThan ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, priceMoreThan: e.target.value }))}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Max Price ($)</label>
              <Input
                type="number"
                placeholder="Any"
                value={filters.priceLowerThan ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, priceLowerThan: e.target.value }))}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Min Dividend ($)</label>
              <Input
                type="number"
                step="0.1"
                placeholder="0"
                value={filters.dividendMoreThan ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, dividendMoreThan: e.target.value }))}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Min Volume</label>
              <Input
                type="number"
                placeholder="0"
                value={filters.volumeMoreThan ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, volumeMoreThan: e.target.value }))}
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button onClick={handleSearch} className="gap-2">
              <Search className="h-4 w-4" />
              Screen Stocks
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setFilters({ exchange: "NYSE,NASDAQ", limit: "50" });
                setHasSearched(false);
              }}
            >
              Reset
            </Button>
            {hasSearched && !isLoading && (
              <span className="text-xs text-muted-foreground ml-2">
                {results.length} results
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {error ? (
        <Card className="border-amber-500/30">
          <CardContent className="py-8 text-center">
            <p className="text-sm font-medium">Screener Unavailable</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
              {(error as Error).message || "The stock screener requires a paid FMP plan. Use the search bar in the navbar to look up individual stocks."}
            </p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <Card>
          <CardContent className="py-4">
            <div className="space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : hasSearched && results.length > 0 ? (
        <Card>
          <CardContent className="py-2">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Symbol</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Market Cap</TableHead>
                    <TableHead className="text-right">Volume</TableHead>
                    <TableHead className="text-right">Beta</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((stock) => (
                    <TableRow key={stock.symbol} className="hover:bg-accent/50">
                      <TableCell>
                        <Link
                          href={`/stock/${stock.symbol}`}
                          className="font-semibold text-sm hover:underline"
                        >
                          {stock.symbol}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm max-w-[200px] truncate">
                        {stock.companyName}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {stock.sector}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-sm">
                        {formatCurrency(stock.price)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-sm">
                        {formatCompactNumber(stock.marketCap, true)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-sm">
                        {formatCompactNumber(stock.volume)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-sm">
                        {stock.beta?.toFixed(2) ?? "N/A"}
                      </TableCell>
                      <TableCell>
                        <Link href={`/stock/${stock.symbol}`}>
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : hasSearched ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No stocks match your criteria. Try adjusting the filters.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Set your filters and click &quot;Screen Stocks&quot; to find matches.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
