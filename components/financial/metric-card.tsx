import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
}

export function MetricCard({ label, value, subValue, trend }: MetricCardProps) {
  const trendColor =
    trend === "up"
      ? "text-emerald-500"
      : trend === "down"
        ? "text-red-500"
        : "text-muted-foreground";

  return (
    <Card>
      <CardContent className="pt-4 pb-4 px-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <p className="text-lg font-bold mt-1 tabular-nums">{value}</p>
        {subValue && (
          <p className={`text-xs mt-0.5 ${trendColor}`}>{subValue}</p>
        )}
      </CardContent>
    </Card>
  );
}
