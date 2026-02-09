export function formatCurrency(value: number | null | undefined, compact = false): string {
  if (value == null || isNaN(value)) return "N/A";
  if (compact) {
    return formatCompactNumber(value, true);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCompactNumber(value: number | null | undefined, isCurrency = false): string {
  if (value == null || isNaN(value)) return "N/A";
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  const prefix = isCurrency ? "$" : "";

  if (absValue >= 1e12) return `${sign}${prefix}${(absValue / 1e12).toFixed(2)}T`;
  if (absValue >= 1e9) return `${sign}${prefix}${(absValue / 1e9).toFixed(2)}B`;
  if (absValue >= 1e6) return `${sign}${prefix}${(absValue / 1e6).toFixed(2)}M`;
  if (absValue >= 1e3) return `${sign}${prefix}${(absValue / 1e3).toFixed(2)}K`;
  return `${sign}${prefix}${absValue.toFixed(2)}`;
}

export function formatPercent(value: number | null | undefined, decimals = 2): string {
  if (value == null || isNaN(value)) return "N/A";
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}

export function formatPercentRaw(value: number | null | undefined, decimals = 2): string {
  if (value == null || isNaN(value)) return "N/A";
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatNumber(value: number | null | undefined, decimals = 2): string {
  if (value == null || isNaN(value)) return "N/A";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatRatio(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return "N/A";
  return value.toFixed(2);
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
