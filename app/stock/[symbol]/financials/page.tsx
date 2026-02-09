"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useIncomeStatement, useBalanceSheet, useCashFlow } from "@/lib/hooks";
import { FinancialTable } from "@/components/financial/financial-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { FinancialPeriod } from "@/types";

const INCOME_ROWS = [
  { label: "Revenue", key: "revenue", format: "compact" as const },
  { label: "Cost of Revenue", key: "costOfRevenue", format: "compact" as const },
  { label: "Gross Profit", key: "grossProfit", format: "compact" as const },
  { label: "Gross Margin", key: "grossProfitRatio", format: "percent" as const },
  { label: "R&D Expenses", key: "researchAndDevelopmentExpenses", format: "compact" as const },
  { label: "SG&A Expenses", key: "sellingGeneralAndAdministrativeExpenses", format: "compact" as const },
  { label: "Operating Income", key: "operatingIncome", format: "compact" as const },
  { label: "Operating Margin", key: "operatingIncomeRatio", format: "percent" as const },
  { label: "Interest Expense", key: "interestExpense", format: "compact" as const },
  { label: "EBITDA", key: "ebitda", format: "compact" as const },
  { label: "Net Income", key: "netIncome", format: "compact" as const },
  { label: "Net Margin", key: "netIncomeRatio", format: "percent" as const },
  { label: "EPS", key: "eps", format: "ratio" as const },
  { label: "EPS (Diluted)", key: "epsdiluted", format: "ratio" as const },
];

const BALANCE_ROWS = [
  { label: "Cash & Equivalents", key: "cashAndCashEquivalents", format: "compact" as const },
  { label: "Short-Term Investments", key: "shortTermInvestments", format: "compact" as const },
  { label: "Net Receivables", key: "netReceivables", format: "compact" as const },
  { label: "Inventory", key: "inventory", format: "compact" as const },
  { label: "Total Current Assets", key: "totalCurrentAssets", format: "compact" as const },
  { label: "PP&E (Net)", key: "propertyPlantEquipmentNet", format: "compact" as const },
  { label: "Goodwill", key: "goodwill", format: "compact" as const },
  { label: "Total Assets", key: "totalAssets", format: "compact" as const },
  { label: "Account Payables", key: "accountPayables", format: "compact" as const },
  { label: "Short-Term Debt", key: "shortTermDebt", format: "compact" as const },
  { label: "Total Current Liabilities", key: "totalCurrentLiabilities", format: "compact" as const },
  { label: "Long-Term Debt", key: "longTermDebt", format: "compact" as const },
  { label: "Total Liabilities", key: "totalLiabilities", format: "compact" as const },
  { label: "Total Equity", key: "totalStockholdersEquity", format: "compact" as const },
  { label: "Total Debt", key: "totalDebt", format: "compact" as const },
  { label: "Net Debt", key: "netDebt", format: "compact" as const },
];

const CASHFLOW_ROWS = [
  { label: "Net Income", key: "netIncome", format: "compact" as const },
  { label: "D&A", key: "depreciationAndAmortization", format: "compact" as const },
  { label: "Stock-Based Comp", key: "stockBasedCompensation", format: "compact" as const },
  { label: "Operating Cash Flow", key: "operatingCashFlow", format: "compact" as const },
  { label: "Capital Expenditure", key: "capitalExpenditure", format: "compact" as const },
  { label: "Free Cash Flow", key: "freeCashFlow", format: "compact" as const },
  { label: "Acquisitions (Net)", key: "acquisitionsNet", format: "compact" as const },
  { label: "Debt Repayment", key: "debtRepayment", format: "compact" as const },
  { label: "Buybacks", key: "commonStockRepurchased", format: "compact" as const },
  { label: "Dividends Paid", key: "dividendsPaid", format: "compact" as const },
  { label: "Net Change in Cash", key: "netChangeInCash", format: "compact" as const },
];

export default function FinancialsPage() {
  const params = useParams();
  const symbol = (params.symbol as string)?.toUpperCase();
  const [period, setPeriod] = useState<FinancialPeriod>("annual");

  const { data: income, isLoading: incomeLoading } = useIncomeStatement(symbol, period);
  const { data: balance, isLoading: balanceLoading } = useBalanceSheet(symbol, period);
  const { data: cashflow, isLoading: cashflowLoading } = useCashFlow(symbol, period);

  const isLoading = incomeLoading || balanceLoading || cashflowLoading;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button
          variant={period === "annual" ? "default" : "outline"}
          size="sm"
          onClick={() => setPeriod("annual")}
        >
          Annual
        </Button>
        <Button
          variant={period === "quarter" ? "default" : "outline"}
          size="sm"
          onClick={() => setPeriod("quarter")}
        >
          Quarterly
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <Tabs defaultValue="income" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="income">Income Statement</TabsTrigger>
            <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
            <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          </TabsList>

          <TabsContent value="income" className="mt-4">
            <FinancialTable
              title="Income Statement"
              rows={INCOME_ROWS}
              data={(income as unknown as Record<string, unknown>[]) ?? []}
            />
          </TabsContent>

          <TabsContent value="balance" className="mt-4">
            <FinancialTable
              title="Balance Sheet"
              rows={BALANCE_ROWS}
              data={(balance as unknown as Record<string, unknown>[]) ?? []}
            />
          </TabsContent>

          <TabsContent value="cashflow" className="mt-4">
            <FinancialTable
              title="Cash Flow Statement"
              rows={CASHFLOW_ROWS}
              data={(cashflow as unknown as Record<string, unknown>[]) ?? []}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
