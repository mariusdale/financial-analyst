"use client";

import { useMarketData, useBatchQuotes } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatCurrency,
  formatPercent,
} from "@/lib/formatters";
import Link from "next/link";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import type { MarketMover, StockQuote } from "@/types";

const INDEX_SYMBOLS = ["SPY", "QQQ", "DIA", "IWM"];

function IndexCard({ quote }: { quote: StockQuote }) {
  const isPositive = quote.changesPercentage >= 0;
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">{quote.symbol}</p>
            <p className="text-xs text-muted-foreground truncate">{quote.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold tabular-nums">{formatCurrency(quote.price)}</p>
            <p
              className={`text-xs font-medium tabular-nums ${isPositive ? "text-emerald-500" : "text-red-500"}`}
            >
              {formatPercent(quote.changesPercentage)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MoverRow({ mover }: { mover: MarketMover }) {
  const isPositive = mover.changesPercentage >= 0;
  return (
    <Link href={`/stock/${mover.symbol}`} className="block">
      <div className="flex items-center justify-between py-2.5 px-1 hover:bg-accent rounded-md transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-sm font-semibold w-16 shrink-0">{mover.symbol}</span>
          <span className="text-xs text-muted-foreground truncate">{mover.name}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm tabular-nums font-medium">{formatCurrency(mover.price)}</span>
          <Badge
            variant="outline"
            className={`text-xs tabular-nums w-20 justify-center ${
              isPositive
                ? "text-emerald-500 border-emerald-500/30"
                : "text-red-500 border-red-500/30"
            }`}
          >
            {formatPercent(mover.changesPercentage)}
          </Badge>
        </div>
      </div>
    </Link>
  );
}

function MoverCard({
  title,
  icon,
  movers,
  isLoading,
}: {
  title: string;
  icon: React.ReactNode;
  movers: MarketMover[];
  isLoading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : movers.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No data available</p>
        ) : (
          <div className="divide-y divide-border/50">
            {movers.slice(0, 8).map((m) => (
              <MoverRow key={m.symbol} mover={m} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: indices, isLoading: indicesLoading, isError: indicesError } = useBatchQuotes(INDEX_SYMBOLS);
  const { data: market, isLoading: marketLoading, isError: marketError } = useMarketData();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Market Overview</h1>
        <p className="text-muted-foreground text-sm">
          Real-time market data and financial analysis tools.
        </p>
      </div>

      {(indicesError || marketError) && !indicesLoading && !marketLoading && (
        <Card className="border-destructive/30">
          <CardContent className="py-6 text-center">
            <p className="text-sm font-medium text-destructive">Unable to load market data</p>
            <p className="text-xs text-muted-foreground mt-1">
              Please verify your FMP API key is set correctly in <code className="font-mono bg-muted px-1 rounded">.env.local</code> and restart the dev server.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {indicesLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[72px]" />)
          : indices?.map((q) => <IndexCard key={q.symbol} quote={q} />)}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <MoverCard
          title="Most Active"
          icon={<Activity className="h-4 w-4 text-blue-500" />}
          movers={market?.actives ?? []}
          isLoading={marketLoading}
        />
        <MoverCard
          title="Top Gainers"
          icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
          movers={market?.gainers ?? []}
          isLoading={marketLoading}
        />
        <MoverCard
          title="Top Losers"
          icon={<TrendingDown className="h-4 w-4 text-red-500" />}
          movers={market?.losers ?? []}
          isLoading={marketLoading}
        />
      </div>
    </div>
  );
}
