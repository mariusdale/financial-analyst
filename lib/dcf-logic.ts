import type { DCFAssumptions, DCFResult, SensitivityCell } from "@/types";

export interface DCFInputs {
  latestRevenue: number;
  totalDebt: number;
  cashAndEquivalents: number;
  sharesOutstanding: number;
  currentPrice: number;
}

export function calculateDCF(inputs: DCFInputs, assumptions: DCFAssumptions): DCFResult {
  const { latestRevenue, totalDebt, cashAndEquivalents, sharesOutstanding, currentPrice } = inputs;
  const {
    revenueGrowthRate,
    operatingMargin,
    taxRate,
    wacc,
    terminalGrowthRate,
    projectionYears,
  } = assumptions;

  const projectedFCFs: { year: number; fcf: number; pvFCF: number }[] = [];
  let totalPVFCF = 0;

  for (let year = 1; year <= projectionYears; year++) {
    const projectedRevenue = latestRevenue * Math.pow(1 + revenueGrowthRate / 100, year);
    const operatingIncome = projectedRevenue * (operatingMargin / 100);
    const nopat = operatingIncome * (1 - taxRate / 100);
    // Approximate FCF as NOPAT (simplified — ignores CapEx/WC changes for clarity)
    const fcf = nopat;
    const discountFactor = Math.pow(1 + wacc / 100, year);
    const pvFCF = fcf / discountFactor;
    projectedFCFs.push({ year, fcf, pvFCF });
    totalPVFCF += pvFCF;
  }

  // Terminal Value using Gordon Growth Model
  const lastFCF = projectedFCFs[projectedFCFs.length - 1]?.fcf ?? 0;
  const terminalValue =
    wacc / 100 > terminalGrowthRate / 100
      ? (lastFCF * (1 + terminalGrowthRate / 100)) / (wacc / 100 - terminalGrowthRate / 100)
      : 0;

  const pvTerminalValue = terminalValue / Math.pow(1 + wacc / 100, projectionYears);

  const enterpriseValue = totalPVFCF + pvTerminalValue;
  const equityValue = enterpriseValue - totalDebt + cashAndEquivalents;
  const intrinsicValuePerShare = sharesOutstanding > 0 ? equityValue / sharesOutstanding : 0;
  const upside =
    currentPrice > 0 ? ((intrinsicValuePerShare - currentPrice) / currentPrice) * 100 : 0;

  return {
    projectedFCFs,
    terminalValue,
    pvTerminalValue,
    enterpriseValue,
    equityValue,
    intrinsicValuePerShare,
    currentPrice,
    upside,
  };
}

export function generateSensitivityTable(
  inputs: DCFInputs,
  baseAssumptions: DCFAssumptions,
  waccRange: number[] = [-2, -1, 0, 1, 2],
  growthRange: number[] = [-1, -0.5, 0, 0.5, 1]
): SensitivityCell[] {
  const cells: SensitivityCell[] = [];

  for (const waccDelta of waccRange) {
    for (const growthDelta of growthRange) {
      const wacc = baseAssumptions.wacc + waccDelta;
      const terminalGrowth = baseAssumptions.terminalGrowthRate + growthDelta;

      if (wacc <= terminalGrowth || wacc <= 0) {
        cells.push({ wacc, terminalGrowth, intrinsicValue: Infinity });
        continue;
      }

      const result = calculateDCF(inputs, {
        ...baseAssumptions,
        wacc,
        terminalGrowthRate: terminalGrowth,
      });
      cells.push({
        wacc,
        terminalGrowth,
        intrinsicValue: result.intrinsicValuePerShare,
      });
    }
  }

  return cells;
}
