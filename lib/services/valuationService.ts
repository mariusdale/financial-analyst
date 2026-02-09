import api from "@/lib/api";
import type { CashFlowStatement, IncomeStatement, BalanceSheet, KeyMetrics } from "@/types";

export interface HistoricalDCFData {
  latestRevenue: number;
  avgRevenueGrowth: number;
  avgOperatingMargin: number;
  effectiveTaxRate: number;
  latestFCF: number;
  totalDebt: number;
  cashAndEquivalents: number;
  sharesOutstanding: number;
  currentPrice: number;
  beta: number;
}

export async function getHistoricalDCFInputs(symbol: string): Promise<HistoricalDCFData> {
  const [incomeRes, cashFlowRes, balanceRes, profileRes, metricsRes] = await Promise.all([
    api.get("/income-statement", { params: { symbol, period: "annual", limit: 5 } }),
    api.get("/cash-flow-statement", { params: { symbol, period: "annual", limit: 5 } }),
    api.get("/balance-sheet-statement", { params: { symbol, period: "annual", limit: 1 } }),
    api.get("/profile", { params: { symbol } }),
    api.get("/key-metrics", { params: { symbol, period: "annual", limit: 5 } }),
  ]);

  const incomeStatements: IncomeStatement[] = incomeRes.data;
  const cashFlows: CashFlowStatement[] = cashFlowRes.data;
  const balance: BalanceSheet = Array.isArray(balanceRes.data) ? balanceRes.data[0] : balanceRes.data;
  const profileRaw = Array.isArray(profileRes.data) ? profileRes.data[0] : profileRes.data;
  const metrics: KeyMetrics[] = metricsRes.data;

  // Calculate average revenue growth
  const revenues = incomeStatements.map((i) => i.revenue).reverse();
  const growthRates: number[] = [];
  for (let i = 1; i < revenues.length; i++) {
    if (revenues[i - 1] > 0) {
      growthRates.push((revenues[i] - revenues[i - 1]) / revenues[i - 1]);
    }
  }
  const avgRevenueGrowth =
    growthRates.length > 0
      ? growthRates.reduce((a, b) => a + b, 0) / growthRates.length
      : 0.05;

  // Average operating margin
  const opMargins = incomeStatements.map((i) => i.operatingIncomeRatio).filter((v) => v != null);
  const avgOperatingMargin =
    opMargins.length > 0 ? opMargins.reduce((a, b) => a + b, 0) / opMargins.length : 0.2;

  // Effective tax rate
  const latestIncome = incomeStatements[0];
  const effectiveTaxRate =
    latestIncome?.operatingIncome > 0
      ? Math.max(0, 1 - latestIncome.netIncome / latestIncome.operatingIncome)
      : 0.21;

  return {
    latestRevenue: incomeStatements[0]?.revenue ?? 0,
    avgRevenueGrowth: Math.max(-0.5, Math.min(avgRevenueGrowth, 1)),
    avgOperatingMargin: Math.max(0, Math.min(avgOperatingMargin, 1)),
    effectiveTaxRate: Math.max(0, Math.min(effectiveTaxRate, 0.5)),
    latestFCF: cashFlows[0]?.freeCashFlow ?? 0,
    totalDebt: balance?.totalDebt ?? 0,
    cashAndEquivalents: balance?.cashAndCashEquivalents ?? 0,
    sharesOutstanding: profileRaw?.marketCap && profileRaw?.price ? profileRaw.marketCap / profileRaw.price : 0,
    currentPrice: profileRaw?.price ?? 0,
    beta: profileRaw?.beta ?? 1,
  };
}
