"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Target } from "lucide-react";
import type { CategorizedTransaction } from "@/types";
import { calculateAssetHoldings, calculateTotalPortfolioValue } from "@/lib/market-values";

interface AIInsightsProps {
  transactions: CategorizedTransaction[];
}

export function AIInsights({ transactions }: AIInsightsProps) {
  const insights = useMemo(() => {
    if (transactions.length === 0) return [];

    const assetHoldings = calculateAssetHoldings(transactions);
    const totalValue = calculateTotalPortfolioValue(transactions);
    
    // Calculate monthly trends
    const monthlyData = transactions.reduce((acc, tx) => {
      const month = tx.date.substring(0, 7); // YYYY-MM
      if (!acc[month]) acc[month] = { inflows: 0, outflows: 0, count: 0 };
      
      if (tx.type === 'inflow') {
        acc[month].inflows += Math.abs(tx.amount);
      } else {
        acc[month].outflows += Math.abs(tx.amount);
      }
      acc[month].count++;
      return acc;
    }, {} as Record<string, { inflows: number; outflows: number; count: number }>);

    const months = Object.keys(monthlyData).sort();
    const recentMonths = months.slice(-3);
    
    // Calculate insights
    const insights = [];

    // 1. Portfolio Diversification Insight
    const topAssets = assetHoldings.slice(0, 3);
    const topAssetsValue = topAssets.reduce((sum, asset) => sum + asset.marketValue, 0);
    const concentration = (topAssetsValue / totalValue) * 100;
    
    if (concentration > 80) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'High Portfolio Concentration',
        description: `Your top 3 assets represent ${concentration.toFixed(1)}% of your portfolio. Consider diversifying to reduce risk.`,
        recommendation: 'Consider adding more assets or rebalancing your portfolio.'
      });
    } else {
      insights.push({
        type: 'success',
        icon: TrendingUp,
        title: 'Good Portfolio Diversification',
        description: `Your portfolio is well-diversified with ${assetHoldings.length} different assets.`,
        recommendation: 'Maintain this diversification strategy for risk management.'
      });
    }

    // 2. Income Trend Analysis
    const recentInflows = recentMonths.reduce((sum, month) => sum + monthlyData[month].inflows, 0);
    const earlierInflows = months.slice(0, -3).reduce((sum, month) => sum + monthlyData[month].inflows, 0);
    const avgRecentInflows = recentInflows / recentMonths.length;
    const avgEarlierInflows = earlierInflows / Math.max(1, months.length - 3);
    
    // Only show income trend if we have sufficient data and no division by zero
    if (avgEarlierInflows > 0 && months.length >= 2) {
      const growthPercentage = ((avgRecentInflows / avgEarlierInflows - 1) * 100);
      
      if (growthPercentage > 20) {
        insights.push({
          type: 'success',
          icon: TrendingUp,
          title: 'Strong Income Growth',
          description: `Your monthly income has increased by ${growthPercentage.toFixed(1)}% recently.`,
          recommendation: 'This growth trend suggests effective income strategies.'
        });
      } else if (growthPercentage < -20) {
        insights.push({
          type: 'warning',
          icon: TrendingDown,
          title: 'Declining Income Trend',
          description: `Your monthly income has decreased by ${Math.abs(growthPercentage).toFixed(1)}% recently.`,
          recommendation: 'Review your income sources and consider new opportunities.'
        });
      } else {
        insights.push({
          type: 'info',
          icon: TrendingUp,
          title: 'Stable Income Trend',
          description: `Your monthly income has remained relatively stable with ${growthPercentage > 0 ? 'a slight increase' : 'a slight decrease'} of ${Math.abs(growthPercentage).toFixed(1)}%.`,
          recommendation: 'Your income strategy is maintaining consistency.'
        });
      }
    } else if (avgRecentInflows > 0) {
      // If no earlier data but recent income exists
      insights.push({
        type: 'success',
        icon: TrendingUp,
        title: 'Active Income Generation',
        description: `You're generating ${avgRecentInflows.toFixed(2)} in average monthly income.`,
        recommendation: 'Great start! Consider diversifying your income sources.'
      });
    }

    // 3. Trading Activity Insight
    const tradingTransactions = transactions.filter(tx => 
      tx.category === 'trading profit' || tx.category === 'trading loss'
    );
    
    if (tradingTransactions.length > 0) {
      const profitableTrades = tradingTransactions.filter(tx => tx.category === 'trading profit');
      const winRate = (profitableTrades.length / tradingTransactions.length) * 100;
      
      if (winRate > 60) {
        insights.push({
          type: 'success',
          icon: Target,
          title: 'Excellent Trading Performance',
          description: `You have a ${winRate.toFixed(1)}% win rate with ${tradingTransactions.length} trades.`,
          recommendation: 'Your trading strategy is working well. Consider scaling up gradually.'
        });
      } else if (winRate < 40) {
        insights.push({
          type: 'warning',
          icon: AlertTriangle,
          title: 'Trading Strategy Review Needed',
          description: `Your win rate is ${winRate.toFixed(1)}% with ${tradingTransactions.length} trades.`,
          recommendation: 'Consider reviewing your trading strategy and risk management.'
        });
      } else {
        insights.push({
          type: 'info',
          icon: Target,
          title: 'Moderate Trading Performance',
          description: `You have a ${winRate.toFixed(1)}% win rate with ${tradingTransactions.length} trades.`,
          recommendation: 'Your trading performance is average. Consider refining your strategy.'
        });
      }
    }

    // 4. Passive Income Analysis
    const passiveIncome = transactions.filter(tx => 
      tx.category === 'staking rewards' || tx.category === 'airdrop'
    );
    const passiveIncomeValue = passiveIncome.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    
    if (totalValue > 0) {
      const passiveIncomePercentage = (passiveIncomeValue / totalValue) * 100;
      
      if (passiveIncomePercentage > 10) {
        insights.push({
          type: 'success',
          icon: Lightbulb,
          title: 'Strong Passive Income Stream',
          description: `Passive income represents ${passiveIncomePercentage.toFixed(1)}% of your portfolio value.`,
          recommendation: 'Excellent! Consider expanding your staking and yield farming activities.'
        });
      } else {
        insights.push({
          type: 'info',
          icon: Lightbulb,
          title: 'Passive Income Opportunity',
          description: `Passive income is ${passiveIncomePercentage.toFixed(1)}% of your portfolio.`,
          recommendation: 'Consider staking more assets to increase passive income streams.'
        });
      }
    } else if (passiveIncomeValue > 0) {
      insights.push({
        type: 'success',
        icon: Lightbulb,
        title: 'Passive Income Generated',
        description: `You've earned ${passiveIncomeValue.toFixed(2)} in passive income.`,
        recommendation: 'Great start! Consider expanding your staking activities.'
      });
    }

    // 5. Risk Management Insight
    const withdrawals = transactions.filter(tx => tx.category === 'withdrawal');
    const totalWithdrawals = withdrawals.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    
    if (totalValue > 0) {
      const withdrawalRate = (totalWithdrawals / totalValue) * 100;
      
      if (withdrawalRate > 50) {
        insights.push({
          type: 'warning',
          icon: AlertTriangle,
          title: 'High Withdrawal Rate',
          description: `You've withdrawn ${withdrawalRate.toFixed(1)}% of your portfolio value.`,
          recommendation: 'Consider reducing withdrawals to allow for portfolio growth.'
        });
      } else if (withdrawalRate < 10) {
        insights.push({
          type: 'success',
          icon: TrendingUp,
          title: 'Conservative Withdrawal Strategy',
          description: `You've withdrawn only ${withdrawalRate.toFixed(1)}% of your portfolio value.`,
          recommendation: 'This conservative approach allows for strong portfolio growth.'
        });
      } else {
        insights.push({
          type: 'info',
          icon: TrendingUp,
          title: 'Moderate Withdrawal Strategy',
          description: `You've withdrawn ${withdrawalRate.toFixed(1)}% of your portfolio value.`,
          recommendation: 'Your withdrawal strategy is balanced. Monitor for optimal growth.'
        });
      }
    } else if (totalWithdrawals > 0) {
      insights.push({
        type: 'info',
        icon: AlertTriangle,
        title: 'Withdrawals Detected',
        description: `You've withdrawn ${totalWithdrawals.toFixed(2)} in total.`,
        recommendation: 'Consider tracking withdrawal patterns for better portfolio management.'
      });
    }

    return insights;
  }, [transactions]);

  if (insights.length === 0) {
    return (
      <Card className="calico-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Upload transaction data to receive AI-powered insights.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="calico-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div key={index} className="p-4 rounded-lg border bg-muted/30">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    insight.type === 'success' ? 'bg-green-100 text-green-600' :
                    insight.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{insight.title}</h4>
                      <Badge variant={
                        insight.type === 'success' ? 'default' :
                        insight.type === 'warning' ? 'destructive' :
                        'secondary'
                      } className="text-xs">
                        {insight.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                    <p className="text-xs text-primary font-medium">{insight.recommendation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
