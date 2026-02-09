"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface ApiErrorProps {
  title?: string;
  message?: string;
}

export function ApiError({
  title = "Unable to Load Data",
  message = "The financial data API returned an error. Please check that your FMP API key is configured in .env.local.",
}: ApiErrorProps) {
  return (
    <Card className="border-destructive/30">
      <CardContent className="py-8 text-center">
        <AlertTriangle className="h-8 w-8 mx-auto text-destructive/50 mb-3" />
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">{message}</p>
      </CardContent>
    </Card>
  );
}
