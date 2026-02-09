"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DCFBuilder } from "@/components/dcf/dcf-builder";
import { Calculator, Search } from "lucide-react";

export default function ValuationPage() {
  const [ticker, setTicker] = useState("");
  const [activeTicker, setActiveTicker] = useState("");

  function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = ticker.trim().toUpperCase();
    if (cleaned) setActiveTicker(cleaned);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">DCF Valuation</h1>
        <p className="text-muted-foreground text-sm">
          Discounted Cash Flow analysis — estimate the intrinsic value of any publicly traded
          company.
        </p>
      </div>

      {/* Ticker Input */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Enter a Ticker Symbol
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnalyze} className="flex gap-2 max-w-md">
            <Input
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="e.g. AAPL, MSFT, GOOGL"
              className="font-mono"
              autoFocus
            />
            <Button type="submit" disabled={!ticker.trim()} className="gap-2 shrink-0">
              <Search className="h-4 w-4" />
              Analyze
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* DCF Results */}
      {activeTicker ? (
        <DCFBuilder symbol={activeTicker} />
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <Calculator className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">
              Enter a ticker symbol above to run a DCF valuation analysis.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              The model will automatically fetch historical data and pre-fill assumptions based on
              the company&apos;s financial history.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
