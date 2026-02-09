"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatCompactNumber, formatPercentRaw } from "@/lib/formatters";

interface FinancialTableRow {
  label: string;
  key: string;
  format?: "currency" | "compact" | "percent" | "ratio" | "number";
}

interface FinancialTableProps {
  title: string;
  rows: FinancialTableRow[];
  data: Record<string, unknown>[];
  yearKey?: string;
}

function formatValue(value: unknown, format?: string): string {
  const num = value as number;
  if (num == null || isNaN(num)) return "N/A";
  switch (format) {
    case "currency":
      return formatCurrency(num);
    case "compact":
      return formatCompactNumber(num, true);
    case "percent":
      return formatPercentRaw(num);
    case "ratio":
      return num.toFixed(2);
    default:
      return formatCompactNumber(num, true);
  }
}

export function FinancialTable({ title, rows, data, yearKey = "calendarYear" }: FinancialTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-8 text-center">No data available</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 bg-background z-10 min-w-[180px] font-semibold">
              {title}
            </TableHead>
            {data.map((d, i) => (
              <TableHead key={i} className="text-right min-w-[100px] tabular-nums">
                {(d[yearKey] as string) || (d["date"] as string)?.split("-")[0] || `Period ${i + 1}`}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.key}>
              <TableCell className="sticky left-0 bg-background z-10 font-medium text-sm">
                {row.label}
              </TableCell>
              {data.map((d, i) => (
                <TableCell key={i} className="text-right tabular-nums text-sm">
                  {formatValue(d[row.key], row.format)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
