"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDCFInputs } from "@/lib/hooks";
import { calculateDCF, generateSensitivityTable } from "@/lib/dcf-logic";
import type { DCFInputs } from "@/lib/dcf-logic";
import type { DCFAssumptions } from "@/types";
import {
  formatCurrency,
  formatCompactNumber,
  formatPercent,
} from "@/lib/formatters";
import { SensitivityTable } from "./sensitivity-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AssumptionFieldProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
  step?: number;
  min?: number;
  max?: number;
}

function AssumptionField({ label, value, onChange, suffix = "%", step = 0.5, min = -50, max = 100 }: AssumptionFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step={step}
          min={min}
          max={max}
          className="pr-8 tabular-nums"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          {suffix}
        </span>
      </div>
    </div>
  );
}

export function DCFBuilder({ symbol }: { symbol: string }) {
  const { data: dcfData, isLoading } = useDCFInputs(symbol);

  const [assumptions, setAssumptions] = useState<DCFAssumptions>({
    revenueGrowthRate: 10,
    operatingMargin: 25,
    taxRate: 21,
    wacc: 10,
    terminalGrowthRate: 2.5,
    projectionYears: 5,
  });

  useEffect(() => {
    if (dcfData) {
      setAssumptions({
        revenueGrowthRate: parseFloat((dcfData.avgRevenueGrowth * 100).toFixed(1)),
        operatingMargin: parseFloat((dcfData.avgOperatingMargin * 100).toFixed(1)),
        taxRate: parseFloat((dcfData.effectiveTaxRate * 100).toFixed(1)),
        wacc: parseFloat(Math.max(6, 4 + dcfData.beta * 5.5).toFixed(1)),
        terminalGrowthRate: 2.5,
        projectionYears: 5,
      });
    }
  }, [dcfData]);

  const inputs: DCFInputs | null = useMemo(() => {
    if (!dcfData) return null;
    return {
      latestRevenue: dcfData.latestRevenue,
      totalDebt: dcfData.totalDebt,
      cashAndEquivalents: dcfData.cashAndEquivalents,
      sharesOutstanding: dcfData.sharesOutstanding,
      currentPrice: dcfData.currentPrice,
    };
  }, [dcfData]);

  const result = useMemo(() => {
    if (!inputs) return null;
    return calculateDCF(inputs, assumptions);
  }, [inputs, assumptions]);

  const sensitivityData = useMemo(() => {
    if (!inputs) return [];
    return generateSensitivityTable(inputs, assumptions);
  }, [inputs, assumptions]);

  const updateAssumption = (key: keyof DCFAssumptions, value: number) => {
    setAssumptions((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (!dcfData || !result || !inputs) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Unable to load DCF data for {symbol}. Financial data may be unavailable.
        </CardContent>
      </Card>
    );
  }

  const isUndervalued = result.upside > 0;

  return (
    <div className="space-y-6">
      {/* Valuation Verdict */}
      <Card className={isUndervalued ? "border-emerald-500/30" : "border-red-500/30"}>
        <CardContent className="py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Intrinsic Value per Share</p>
              <p className="text-3xl font-bold tabular-nums">
                {formatCurrency(result.intrinsicValuePerShare)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Current Price</p>
              <p className="text-xl font-semibold tabular-nums">
                {formatCurrency(result.currentPrice)}
              </p>
            </div>
            <Badge
              variant={isUndervalued ? "default" : "destructive"}
              className={`text-sm px-3 py-1 ${isUndervalued ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}
            >
              {formatPercent(result.upside)} {isUndervalued ? "Upside" : "Downside"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Assumptions Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Assumptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <AssumptionField
              label="Revenue Growth"
              value={assumptions.revenueGrowthRate}
              onChange={(v) => updateAssumption("revenueGrowthRate", v)}
            />
            <AssumptionField
              label="Operating Margin"
              value={assumptions.operatingMargin}
              onChange={(v) => updateAssumption("operatingMargin", v)}
            />
            <AssumptionField
              label="Tax Rate"
              value={assumptions.taxRate}
              onChange={(v) => updateAssumption("taxRate", v)}
              min={0}
              max={50}
            />
            <AssumptionField
              label="WACC"
              value={assumptions.wacc}
              onChange={(v) => updateAssumption("wacc", v)}
              min={1}
              max={30}
            />
            <AssumptionField
              label="Terminal Growth"
              value={assumptions.terminalGrowthRate}
              onChange={(v) => updateAssumption("terminalGrowthRate", v)}
              min={0}
              max={10}
            />
            <AssumptionField
              label="Projection Years"
              value={assumptions.projectionYears}
              onChange={(v) => updateAssumption("projectionYears", v)}
              suffix="yrs"
              step={1}
              min={3}
              max={10}
            />
          </div>
        </CardContent>
      </Card>

      {/* Projected FCFs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Projected Free Cash Flows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  {result.projectedFCFs.map((p) => (
                    <TableHead key={p.year} className="text-right">
                      Year {p.year}
                    </TableHead>
                  ))}
                  <TableHead className="text-right">Terminal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">FCF</TableCell>
                  {result.projectedFCFs.map((p) => (
                    <TableCell key={p.year} className="text-right tabular-nums text-sm">
                      {formatCompactNumber(p.fcf, true)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right tabular-nums text-sm">
                    {formatCompactNumber(result.terminalValue, true)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">PV of FCF</TableCell>
                  {result.projectedFCFs.map((p) => (
                    <TableCell key={p.year} className="text-right tabular-nums text-sm">
                      {formatCompactNumber(p.pvFCF, true)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right tabular-nums text-sm">
                    {formatCompactNumber(result.pvTerminalValue, true)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Enterprise Value</p>
              <p className="font-semibold tabular-nums">{formatCompactNumber(result.enterpriseValue, true)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Less: Debt</p>
              <p className="font-semibold tabular-nums text-red-500">
                -{formatCompactNumber(inputs.totalDebt, true)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Plus: Cash</p>
              <p className="font-semibold tabular-nums text-emerald-500">
                +{formatCompactNumber(inputs.cashAndEquivalents, true)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Equity Value</p>
              <p className="font-semibold tabular-nums">{formatCompactNumber(result.equityValue, true)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sensitivity Analysis */}
      <SensitivityTable
        data={sensitivityData}
        baseWACC={assumptions.wacc}
        baseGrowth={assumptions.terminalGrowthRate}
        currentPrice={result.currentPrice}
      />
    </div>
  );
}
