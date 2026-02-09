"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type {
  StockProfile,
  StockQuote,
  SearchResult,
  HistoricalPrice,
  KeyMetrics,
  MarketMover,
  IncomeStatement,
  BalanceSheet,
  CashFlowStatement,
  FinancialPeriod,
} from "@/types";
import type { HistoricalDCFData } from "@/lib/services/valuationService";

const client = axios.create({ baseURL: "/api", timeout: 15000 });

export function useSearch(query: string) {
  return useQuery<SearchResult[]>({
    queryKey: ["search", query],
    queryFn: async () => {
      const { data } = await client.get("/search", { params: { q: query } });
      return data;
    },
    enabled: query.length >= 1,
    staleTime: 30000,
  });
}

export function useProfile(symbol: string) {
  return useQuery<StockProfile>({
    queryKey: ["profile", symbol],
    queryFn: async () => {
      const { data } = await client.get("/profile", { params: { symbol } });
      return data;
    },
    enabled: !!symbol,
  });
}

export function useQuote(symbol: string) {
  return useQuery<StockQuote>({
    queryKey: ["quote", symbol],
    queryFn: async () => {
      const { data } = await client.get("/quote", { params: { symbol } });
      return data;
    },
    enabled: !!symbol,
  });
}

export function useBatchQuotes(symbols: string[]) {
  return useQuery<StockQuote[]>({
    queryKey: ["batch-quotes", symbols.join(",")],
    queryFn: async () => {
      const { data } = await client.get("/quote", {
        params: { symbols: symbols.join(",") },
      });
      return data;
    },
    enabled: symbols.length > 0,
  });
}

export function useHistoricalPrices(symbol: string, from?: string, to?: string) {
  return useQuery<HistoricalPrice[]>({
    queryKey: ["historical", symbol, from, to],
    queryFn: async () => {
      const { data } = await client.get("/historical", { params: { symbol, from, to } });
      return data;
    },
    enabled: !!symbol,
  });
}

export function useKeyMetrics(symbol: string, period: FinancialPeriod = "annual") {
  return useQuery<KeyMetrics[]>({
    queryKey: ["metrics", symbol, period],
    queryFn: async () => {
      const { data } = await client.get("/metrics", { params: { symbol, period } });
      return data;
    },
    enabled: !!symbol,
  });
}

export function useIncomeStatement(symbol: string, period: FinancialPeriod = "annual") {
  return useQuery<IncomeStatement[]>({
    queryKey: ["income-statement", symbol, period],
    queryFn: async () => {
      const { data } = await client.get("/income-statement", { params: { symbol, period } });
      return data;
    },
    enabled: !!symbol,
  });
}

export function useBalanceSheet(symbol: string, period: FinancialPeriod = "annual") {
  return useQuery<BalanceSheet[]>({
    queryKey: ["balance-sheet", symbol, period],
    queryFn: async () => {
      const { data } = await client.get("/balance-sheet", { params: { symbol, period } });
      return data;
    },
    enabled: !!symbol,
  });
}

export function useCashFlow(symbol: string, period: FinancialPeriod = "annual") {
  return useQuery<CashFlowStatement[]>({
    queryKey: ["cash-flow", symbol, period],
    queryFn: async () => {
      const { data } = await client.get("/cash-flow", { params: { symbol, period } });
      return data;
    },
    enabled: !!symbol,
  });
}

export function useMarketData() {
  return useQuery<{ gainers: MarketMover[]; losers: MarketMover[]; actives: MarketMover[] }>({
    queryKey: ["market"],
    queryFn: async () => {
      const { data } = await client.get("/market");
      return data;
    },
  });
}

export function useDCFInputs(symbol: string) {
  return useQuery<HistoricalDCFData>({
    queryKey: ["dcf-inputs", symbol],
    queryFn: async () => {
      const { data } = await client.get("/dcf-inputs", { params: { symbol } });
      return data;
    },
    enabled: !!symbol,
  });
}

export interface ScreenerFilters {
  marketCapMoreThan?: string;
  marketCapLowerThan?: string;
  priceMoreThan?: string;
  priceLowerThan?: string;
  dividendMoreThan?: string;
  volumeMoreThan?: string;
  sector?: string;
  exchange?: string;
  limit?: string;
}

export interface ScreenerResult {
  symbol: string;
  companyName: string;
  marketCap: number;
  sector: string;
  industry: string;
  price: number;
  lastAnnualDividend: number;
  volume: number;
  exchange: string;
  exchangeShortName: string;
  beta: number;
  country: string;
  isActivelyTrading: boolean;
}

export function useScreener(filters: ScreenerFilters, enabled = true) {
  return useQuery<ScreenerResult[]>({
    queryKey: ["screener", filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      for (const [k, v] of Object.entries(filters)) {
        if (v) params[k] = v;
      }
      const res = await client.get("/screener", { params });
      if (res.data?.error) throw new Error(res.data.error);
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled,
    staleTime: 60000,
    retry: false,
  });
}
