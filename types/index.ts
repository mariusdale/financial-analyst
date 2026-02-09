// ===== Stock Profile & Quote =====
export interface StockProfile {
  symbol: string;
  companyName: string;
  price: number;
  changes: number;
  changesPercentage: number;
  currency: string;
  exchange: string;
  exchangeShortName: string;
  industry: string;
  sector: string;
  country: string;
  mktCap: number;
  description: string;
  ceo: string;
  fullTimeEmployees: string;
  image: string;
  ipoDate: string;
  website: string;
  beta: number;
  volAvg: number;
  lastDiv: number;
  range: string;
  dcfDiff: number;
  dcf: number;
  isEtf: boolean;
  isActivelyTrading: boolean;
}

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  change: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  marketCap: number;
  priceAvg50: number;
  priceAvg200: number;
  exchange: string;
  volume: number;
  avgVolume: number;
  open: number;
  previousClose: number;
  eps: number;
  pe: number;
  earningsAnnouncement: string;
  sharesOutstanding: number;
  timestamp: number;
}

export interface SearchResult {
  symbol: string;
  name: string;
  currency: string;
  stockExchange: string;
  exchangeShortName: string;
}

// ===== Key Metrics =====
export interface KeyMetrics {
  symbol: string;
  date: string;
  period: string;
  revenuePerShare: number;
  netIncomePerShare: number;
  operatingCashFlowPerShare: number;
  freeCashFlowPerShare: number;
  cashPerShare: number;
  bookValuePerShare: number;
  peRatio: number;
  priceToSalesRatio: number;
  pbRatio: number;
  evToSales: number;
  evToOperatingCashFlow: number;
  evToFreeCashFlow: number;
  debtToEquity: number;
  debtToAssets: number;
  dividendYield: number;
  payoutRatio: number;
  roic: number;
  roe: number;
  roa: number;
  currentRatio: number;
  interestCoverage: number;
  earningsYield: number;
  freeCashFlowYield: number;
  enterpriseValue: number;
  marketCap: number;
}

// ===== Financial Statements =====
export interface IncomeStatement {
  date: string;
  symbol: string;
  reportedCurrency: string;
  calendarYear: string;
  period: string;
  revenue: number;
  costOfRevenue: number;
  grossProfit: number;
  grossProfitRatio: number;
  researchAndDevelopmentExpenses: number;
  sellingGeneralAndAdministrativeExpenses: number;
  operatingExpenses: number;
  operatingIncome: number;
  operatingIncomeRatio: number;
  interestExpense: number;
  ebitda: number;
  ebitdaratio: number;
  netIncome: number;
  netIncomeRatio: number;
  eps: number;
  epsdiluted: number;
  weightedAverageShsOut: number;
  weightedAverageShsOutDil: number;
}

export interface BalanceSheet {
  date: string;
  symbol: string;
  reportedCurrency: string;
  calendarYear: string;
  period: string;
  cashAndCashEquivalents: number;
  shortTermInvestments: number;
  netReceivables: number;
  inventory: number;
  totalCurrentAssets: number;
  propertyPlantEquipmentNet: number;
  goodwill: number;
  intangibleAssets: number;
  longTermInvestments: number;
  totalNonCurrentAssets: number;
  totalAssets: number;
  accountPayables: number;
  shortTermDebt: number;
  totalCurrentLiabilities: number;
  longTermDebt: number;
  totalNonCurrentLiabilities: number;
  totalLiabilities: number;
  totalStockholdersEquity: number;
  totalEquity: number;
  totalLiabilitiesAndStockholdersEquity: number;
  totalDebt: number;
  netDebt: number;
}

export interface CashFlowStatement {
  date: string;
  symbol: string;
  reportedCurrency: string;
  calendarYear: string;
  period: string;
  netIncome: number;
  depreciationAndAmortization: number;
  stockBasedCompensation: number;
  operatingCashFlow: number;
  capitalExpenditure: number;
  freeCashFlow: number;
  acquisitionsNet: number;
  investmentsInPropertyPlantAndEquipment: number;
  netCashUsedForInvestingActivites: number;
  debtRepayment: number;
  commonStockRepurchased: number;
  dividendsPaid: number;
  netCashUsedProvidedByFinancingActivities: number;
  netChangeInCash: number;
}

// ===== Historical Price =====
export interface HistoricalPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose: number;
  volume: number;
  changePercent: number;
}

// ===== Market Movers =====
export interface MarketMover {
  symbol: string;
  name: string;
  change: number;
  price: number;
  changesPercentage: number;
}

// ===== DCF =====
export interface DCFAssumptions {
  revenueGrowthRate: number;
  operatingMargin: number;
  taxRate: number;
  wacc: number;
  terminalGrowthRate: number;
  projectionYears: number;
}

export interface DCFResult {
  projectedFCFs: { year: number; fcf: number; pvFCF: number }[];
  terminalValue: number;
  pvTerminalValue: number;
  enterpriseValue: number;
  equityValue: number;
  intrinsicValuePerShare: number;
  currentPrice: number;
  upside: number;
}

export interface SensitivityCell {
  wacc: number;
  terminalGrowth: number;
  intrinsicValue: number;
}

export type FinancialPeriod = "annual" | "quarter";
export type PriceTimeframe = "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y";
