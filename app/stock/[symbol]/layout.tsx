"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useProfile, useQuote } from "@/lib/hooks";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatCurrency,
  formatPercent,
  formatCompactNumber,
} from "@/lib/formatters";
import { Building2, ArrowLeft } from "lucide-react";

const TABS = [
  { label: "Overview", href: "" },
  { label: "Financials", href: "/financials" },
  { label: "DCF Valuation", href: "/dcf" },
];

export default function SymbolLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const symbol = (params.symbol as string)?.toUpperCase();

  const { data: profile, isLoading: profileLoading } = useProfile(symbol);
  const { data: quote, isLoading: quoteLoading } = useQuote(symbol);

  const isLoading = profileLoading || quoteLoading;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-5 w-96" />
          </div>
        ) : profile && quote ? (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold">{symbol}</h1>
              <span className="text-lg text-muted-foreground">{profile.companyName}</span>
              <Badge variant="outline" className="text-xs">
                {profile.exchangeShortName}
              </Badge>
            </div>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold tabular-nums">
                {formatCurrency(quote.price)}
              </span>
              <span
                className={`text-lg font-semibold tabular-nums ${
                  quote.changesPercentage >= 0 ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {quote.change >= 0 ? "+" : ""}
                {formatCurrency(quote.change)} ({formatPercent(quote.changesPercentage)})
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {profile.sector} — {profile.industry}
              </span>
              <span>Mkt Cap: {formatCompactNumber(quote.marketCap, true)}</span>
              <span>P/E: {quote.pe?.toFixed(2) ?? "N/A"}</span>
              <span>Vol: {formatCompactNumber(quote.volume)}</span>
            </div>
          </>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <p className="text-lg font-medium">Ticker not found: {symbol}</p>
            <p className="text-sm mt-1">Please check the symbol and try again.</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <nav className="flex gap-1 border-b">
        {TABS.map((tab) => {
          const tabHref = `/stock/${symbol?.toLowerCase()}${tab.href}`;
          const isActive =
            tab.href === ""
              ? pathname === `/stock/${symbol}` || pathname === `/stock/${symbol?.toLowerCase()}`
              : pathname === tabHref || pathname === `/stock/${symbol}${tab.href}`;

          return (
            <Link
              key={tab.label}
              href={tabHref}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {children}
    </div>
  );
}
