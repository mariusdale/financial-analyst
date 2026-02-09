"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import type { SensitivityCell } from "@/types";

interface SensitivityTableProps {
  data: SensitivityCell[];
  baseWACC: number;
  baseGrowth: number;
  currentPrice: number;
}

export function SensitivityTable({ data, baseWACC, baseGrowth, currentPrice }: SensitivityTableProps) {
  const { waccValues, growthValues, grid } = useMemo(() => {
    const waccSet = new Set<number>();
    const growthSet = new Set<number>();
    const map = new Map<string, number>();

    for (const cell of data) {
      waccSet.add(cell.wacc);
      growthSet.add(cell.terminalGrowth);
      map.set(`${cell.wacc}-${cell.terminalGrowth}`, cell.intrinsicValue);
    }

    return {
      waccValues: Array.from(waccSet).sort((a, b) => a - b),
      growthValues: Array.from(growthSet).sort((a, b) => a - b),
      grid: map,
    };
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Sensitivity Analysis (WACC vs Terminal Growth)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">WACC \ Growth</TableHead>
                {growthValues.map((g) => (
                  <TableHead
                    key={g}
                    className={`text-right text-xs tabular-nums ${
                      g === baseGrowth ? "bg-accent font-bold" : ""
                    }`}
                  >
                    {g.toFixed(1)}%
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {waccValues.map((w) => (
                <TableRow key={w}>
                  <TableCell
                    className={`font-medium text-xs tabular-nums ${
                      w === baseWACC ? "bg-accent font-bold" : ""
                    }`}
                  >
                    {w.toFixed(1)}%
                  </TableCell>
                  {growthValues.map((g) => {
                    const val = grid.get(`${w}-${g}`) ?? 0;
                    const isBase = w === baseWACC && g === baseGrowth;
                    const isValid = isFinite(val) && val > 0;
                    const isAbovePrice = isValid && val > currentPrice;

                    return (
                      <TableCell
                        key={g}
                        className={`text-right text-xs tabular-nums ${
                          isBase
                            ? "bg-primary/10 font-bold ring-1 ring-primary/30"
                            : isAbovePrice
                              ? "text-emerald-600"
                              : isValid
                                ? "text-red-500"
                                : "text-muted-foreground"
                        }`}
                      >
                        {isValid ? formatCurrency(val) : "N/A"}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Green values indicate the stock is undervalued at that WACC/Growth combination.
          Highlighted cell is the current assumption.
        </p>
      </CardContent>
    </Card>
  );
}
