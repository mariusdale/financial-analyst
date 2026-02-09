import api from "@/lib/api";
import type {
  IncomeStatement,
  BalanceSheet,
  CashFlowStatement,
  FinancialPeriod,
} from "@/types";

export async function getIncomeStatement(
  symbol: string,
  period: FinancialPeriod = "annual",
  limit = 5
): Promise<IncomeStatement[]> {
  const { data } = await api.get("/income-statement", {
    params: { symbol, period, limit },
  });
  return data;
}

export async function getBalanceSheet(
  symbol: string,
  period: FinancialPeriod = "annual",
  limit = 5
): Promise<BalanceSheet[]> {
  const { data } = await api.get("/balance-sheet-statement", {
    params: { symbol, period, limit },
  });
  return data;
}

export async function getCashFlowStatement(
  symbol: string,
  period: FinancialPeriod = "annual",
  limit = 5
): Promise<CashFlowStatement[]> {
  const { data } = await api.get("/cash-flow-statement", {
    params: { symbol, period, limit },
  });
  return data;
}
