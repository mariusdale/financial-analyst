"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useHistoricalPrices } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/formatters";
import type { PriceTimeframe } from "@/types";

const TIMEFRAMES: { label: string; value: PriceTimeframe }[] = [
  { label: "1W", value: "1W" },
  { label: "1M", value: "1M" },
  { label: "3M", value: "3M" },
  { label: "1Y", value: "1Y" },
  { label: "5Y", value: "5Y" },
];

function getDateRange(tf: PriceTimeframe): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  switch (tf) {
    case "1D":
      from.setDate(from.getDate() - 1);
      break;
    case "1W":
      from.setDate(from.getDate() - 7);
      break;
    case "1M":
      from.setMonth(from.getMonth() - 1);
      break;
    case "3M":
      from.setMonth(from.getMonth() - 3);
      break;
    case "1Y":
      from.setFullYear(from.getFullYear() - 1);
      break;
    case "5Y":
      from.setFullYear(from.getFullYear() - 5);
      break;
  }
  return {
    from: from.toISOString().split("T")[0],
    to: to.toISOString().split("T")[0],
  };
}

export function PriceChart({ symbol }: { symbol: string }) {
  const [timeframe, setTimeframe] = useState<PriceTimeframe>("1Y");
  const { from, to } = useMemo(() => getDateRange(timeframe), [timeframe]);
  const { data: prices = [], isLoading } = useHistoricalPrices(symbol, from, to);

  const chartData = useMemo(
    () =>
      [...prices]
        .reverse()
        .map((p) => ({
          date: p.date,
          price: p.close,
        })),
    [prices]
  );

  const isPositive =
    chartData.length >= 2 && chartData[chartData.length - 1].price >= chartData[0].price;
  const strokeColor = isPositive ? "#10b981" : "#ef4444";
  const fillColor = isPositive ? "#10b98120" : "#ef444420";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Price History</CardTitle>
        <div className="flex gap-1">
          {TIMEFRAMES.map((tf) => (
            <Button
              key={tf.value}
              variant={timeframe === tf.value ? "default" : "ghost"}
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={() => setTimeframe(tf.value)}
            >
              {tf.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
            No price data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={strokeColor} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(d) =>
                  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }
                tick={{ fontSize: 11 }}
                stroke="hsl(var(--muted-foreground))"
                tickLine={false}
                axisLine={false}
                minTickGap={40}
              />
              <YAxis
                domain={["auto", "auto"]}
                tickFormatter={(v) => `$${v}`}
                tick={{ fontSize: 11 }}
                stroke="hsl(var(--muted-foreground))"
                tickLine={false}
                axisLine={false}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number | undefined) => [formatCurrency(value ?? 0), "Price"]}
                labelFormatter={(label) =>
                  new Date(label).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                }
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={strokeColor}
                strokeWidth={2}
                fill={`url(#gradient-${symbol})`}
                dot={false}
                activeDot={{ r: 4, fill: strokeColor }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
