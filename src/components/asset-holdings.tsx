"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CryptoIcon } from "./icons/crypto-icons";
import { calculateAssetHoldings, formatAssetValue } from "@/lib/market-values";
import type { CategorizedTransaction } from "@/types";
import { Wallet, TrendingUp } from "lucide-react";

interface AssetHoldingsProps {
  transactions: CategorizedTransaction[];
}

export function AssetHoldings({ transactions }: AssetHoldingsProps) {
  const assetHoldings = useMemo(() => {
    return calculateAssetHoldings(transactions);
  }, [transactions]);

  const totalValue = useMemo(() => {
    return assetHoldings.reduce((sum, holding) => sum + holding.marketValue, 0);
  }, [assetHoldings]);

  if (assetHoldings.length === 0) {
    return (
      <Card className="calico-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Asset Holdings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No assets found in your portfolio.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="calico-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Asset Holdings
          </CardTitle>
          <Badge variant="secondary" className="text-sm">
            Total: {formatAssetValue('USD', totalValue)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assetHoldings.map((holding) => (
            <div key={holding.currency} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <CryptoIcon currency={holding.currency} className="h-6 w-6" />
                  <div>
                    <div className="font-medium">{holding.currency}</div>
                    <div className="text-sm text-muted-foreground">
                      {holding.amount.toFixed(6)} {holding.currency}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-primary">
                  {formatAssetValue('USD', holding.marketValue)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {((holding.marketValue / totalValue) * 100).toFixed(1)}% of portfolio
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 text-sm text-primary">
            <TrendingUp className="h-4 w-4" />
            <span className="font-medium">Portfolio Summary</span>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Your portfolio contains {assetHoldings.length} different assets with a total market value of{' '}
            <span className="font-medium text-foreground">{formatAssetValue('USD', totalValue)}</span>.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
