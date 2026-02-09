"use client";

import { useParams } from "next/navigation";
import { useProfile, useKeyMetrics } from "@/lib/hooks";
import { PriceChart } from "@/components/charts/price-chart";
import { MetricCard } from "@/components/financial/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatRatio,
  formatPercentRaw,
} from "@/lib/formatters";

export default function StockOverviewPage() {
  const params = useParams();
  const symbol = (params.symbol as string)?.toUpperCase();
  const { data: profile, isLoading: profileLoading } = useProfile(symbol);
  const { data: metrics, isLoading: metricsLoading } = useKeyMetrics(symbol);

  const latestMetrics = metrics?.[0];
  const isLoading = profileLoading || metricsLoading;

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[80px]" />
          ))}
        </div>
      ) : latestMetrics ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricCard label="P/E Ratio" value={formatRatio(latestMetrics.peRatio)} />
          <MetricCard label="P/B Ratio" value={formatRatio(latestMetrics.pbRatio)} />
          <MetricCard label="P/S Ratio" value={formatRatio(latestMetrics.priceToSalesRatio)} />
          <MetricCard label="Div Yield" value={formatPercentRaw(latestMetrics.dividendYield)} />
          <MetricCard label="ROE" value={formatPercentRaw(latestMetrics.roe)} />
          <MetricCard label="Debt/Equity" value={formatRatio(latestMetrics.debtToEquity)} />
        </div>
      ) : null}

      <PriceChart symbol={symbol} />

      {profileLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : profile?.description ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">About {profile.companyName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {profile.description}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t">
              <div>
                <p className="text-xs text-muted-foreground">CEO</p>
                <p className="text-sm font-medium">{profile.ceo || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Employees</p>
                <p className="text-sm font-medium">
                  {profile.fullTimeEmployees
                    ? parseInt(profile.fullTimeEmployees).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">IPO Date</p>
                <p className="text-sm font-medium">{profile.ipoDate || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Beta</p>
                <p className="text-sm font-medium">{profile.beta?.toFixed(2) ?? "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
