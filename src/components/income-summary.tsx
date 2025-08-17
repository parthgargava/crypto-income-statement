"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategorizedTransaction } from "@/types";
import { ArrowDownLeft, ArrowUpRight, Scale, DollarSign } from "lucide-react";
import { calculateTotalPortfolioValue, calculateAssetHoldings } from "@/lib/market-values";

interface IncomeSummaryProps {
  transactions: CategorizedTransaction[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export function IncomeSummary({ transactions }: IncomeSummaryProps) {
  const summary = useMemo(() => {
    // Calculate total income as the market value of all assets
    const totalIncome = calculateTotalPortfolioValue(transactions);
    
    // Calculate traditional inflow/outflow for comparison
    const totalInflow = transactions
      .filter((t) => t.type === "inflow")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalOutflow = transactions
      .filter((t) => t.type === "outflow")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const netIncome = totalInflow - totalOutflow;

    return { totalIncome, totalInflow, totalOutflow, netIncome };
  }, [transactions]);

  return (
    <div>
      <h2 className="calico-heading mb-6">Income Summary</h2>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="calico-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-foreground">Total Income</CardTitle>
            <div className="calico-gradient p-2 rounded-lg">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary mb-2">{formatCurrency(summary.totalIncome)}</div>
            <p className="text-xs text-muted-foreground">Market value of all assets</p>
          </CardContent>
        </Card>
        <Card className="calico-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-foreground">Total Outflows</CardTitle>
            <div className="bg-destructive/20 p-2 rounded-lg">
              <ArrowDownLeft className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive mb-2">{formatCurrency(summary.totalOutflow)}</div>
            <p className="text-xs text-muted-foreground">All outflows from transfers, payments, etc.</p>
          </CardContent>
        </Card>
        <Card className="calico-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-foreground">Net Income</CardTitle>
            <div className="bg-secondary/20 p-2 rounded-lg">
              <Scale className="h-4 w-4 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold mb-2 ${summary.netIncome >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {formatCurrency(summary.netIncome)}
            </div>
            <p className="text-xs text-muted-foreground">The difference between income and outflows.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
