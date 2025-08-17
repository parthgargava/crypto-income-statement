"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategorizedTransaction } from "@/types";
import { ArrowDownLeft, ArrowUpRight, Scale } from "lucide-react";

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
    const totalInflow = transactions
      .filter((t) => t.type === "inflow")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalOutflow = transactions
      .filter((t) => t.type === "outflow")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const netIncome = totalInflow - totalOutflow;

    return { totalInflow, totalOutflow, netIncome };
  }, [transactions]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Income Summary</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{formatCurrency(summary.totalInflow)}</div>
            <p className="text-xs text-muted-foreground">All inflows from rewards, salary, etc.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outflows</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{formatCurrency(summary.totalOutflow)}</div>
            <p className="text-xs text-muted-foreground">All outflows from transfers, payments, etc.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.netIncome >= 0 ? 'text-foreground' : 'text-red-500'}`}>{formatCurrency(summary.netIncome)}</div>
            <p className="text-xs text-muted-foreground">The difference between income and outflows.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
