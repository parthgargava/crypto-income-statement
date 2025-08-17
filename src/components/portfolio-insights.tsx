"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TrendingUp, ShieldAlert, PieChart as PieChartIcon, BarChart3 } from "lucide-react";
import type { CategorizedTransaction } from "@/types";

interface PortfolioInsightsProps {
  transactions: CategorizedTransaction[];
}

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export function PortfolioInsights({ transactions }: PortfolioInsightsProps) {
  const { assetData, monthlyIncomeData } = useMemo(() => {
    const assetMap: Record<string, number> = {};
    const monthlyMap: Record<string, number> = {};

    transactions.forEach((t) => {
      // Asset breakdown (simple sum of amounts, not real-time value)
      assetMap[t.currency] = (assetMap[t.currency] || 0) + t.amount;

      // Monthly income
      if (t.type === "inflow") {
        const month = new Date(t.date).toLocaleString('default', { month: 'short', year: '2-digit' });
        monthlyMap[month] = (monthlyMap[month] || 0) + t.amount;
      }
    });

    const assetData = Object.entries(assetMap)
        .filter(([, value]) => value > 0)
        .map(([name, value]) => ({ name, value: Math.round(value) }))
        .sort((a, b) => b.value - a.value);

    const monthlyIncomeData = Object.entries(monthlyMap)
      .map(([name, income]) => ({ name, income }))
      .reverse();

    return { assetData, monthlyIncomeData };
  }, [transactions]);
  
  const chartConfig = {
    value: { label: "Value" },
    ...Object.fromEntries(assetData.map(d => [d.name, { label: d.name }]))
  };

  const monthlyChartConfig = {
    income: { label: "Monthly Income", color: "hsl(var(--chart-1))" },
  }

  return (
    <div>
        <h2 className="calico-heading mb-6">Portfolio Insights</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="calico-card lg:col-span-1">
                <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="calico-gradient p-2 rounded-lg">
                        <PieChartIcon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-foreground">Asset Breakdown</CardTitle>
                        <CardDescription>Current holdings distribution by asset.</CardDescription>
                      </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
                        <PieChart>
                            <Tooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                            <Pie data={assetData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {assetData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                             <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card className="calico-card lg:col-span-2">
                <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="calico-gradient p-2 rounded-lg">
                        <BarChart3 className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-foreground">Monthly Income Trend</CardTitle>
                        <CardDescription>Inflows over the past several months.</CardDescription>
                      </div>
                    </div>
                </CardHeader>
                <CardContent className="h-[300px] w-full">
                    <ChartContainer config={monthlyChartConfig} className="h-full w-full">
                        <BarChart data={monthlyIncomeData} accessibilityLayer>
                            <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                            <YAxis tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} stroke="hsl(var(--muted-foreground))" />
                            <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card className="calico-card lg:col-span-3">
                <CardHeader>
                    <CardTitle className="text-foreground">AI-Powered Insights</CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert className="border-primary/20 bg-primary/5">
                        <ShieldAlert className="h-4 w-4 text-primary" />
                        <AlertTitle className="text-foreground">Volatility Analysis</AlertTitle>
                        <AlertDescription className="text-muted-foreground">
                            Your primary income sources from Staking (ETH) and Salary (USDC) show low to moderate volatility. Consider diversifying staking rewards beyond a single asset to further stabilize income.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
