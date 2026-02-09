"use client";

import { useParams } from "next/navigation";
import { DCFBuilder } from "@/components/dcf/dcf-builder";

export default function StockDCFPage() {
  const params = useParams();
  const symbol = (params.symbol as string)?.toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">DCF Valuation Model</h2>
        <p className="text-sm text-muted-foreground">
          Discounted Cash Flow analysis for {symbol}. Adjust assumptions below to see how they
          affect the intrinsic value estimate.
        </p>
      </div>
      <DCFBuilder symbol={symbol} />
    </div>
  );
}
