// Market value calculation utility
// This provides current market prices for crypto assets

export interface AssetHolding {
  currency: string;
  amount: number;
  marketValue: number;
}

// Current market prices (as of 2024 - these would be fetched from an API in production)
const MARKET_PRICES: Record<string, number> = {
  'BTC': 45000,    // Bitcoin
  'ETH': 3200,     // Ethereum
  'USDC': 1,       // USD Coin (stablecoin)
  'USDT': 1,       // Tether (stablecoin)
  'SOL': 98.50,    // Solana
  'ADA': 0.45,     // Cardano
  'JUP': 0.85,     // Jupiter
  'USD': 1,        // US Dollar
};

export function calculateAssetHoldings(transactions: any[]): AssetHolding[] {
  const holdings: Record<string, number> = {};

  // Calculate total holdings for each currency
  transactions.forEach((transaction) => {
    const { currency, amount } = transaction;
    holdings[currency] = (holdings[currency] || 0) + amount;
  });

  // Convert to market values
  const assetHoldings: AssetHolding[] = Object.entries(holdings)
    .filter(([, amount]) => amount > 0) // Only positive holdings
    .map(([currency, amount]) => {
      const price = MARKET_PRICES[currency] || 0;
      const marketValue = amount * price;
      
      return {
        currency,
        amount,
        marketValue,
      };
    })
    .sort((a, b) => b.marketValue - a.marketValue); // Sort by market value

  return assetHoldings;
}

export function calculateTotalPortfolioValue(transactions: any[]): number {
  const holdings = calculateAssetHoldings(transactions);
  return holdings.reduce((total, holding) => total + holding.marketValue, 0);
}

export function getMarketPrice(currency: string): number {
  return MARKET_PRICES[currency] || 0;
}

export function formatAssetValue(currency: string, amount: number): string {
  const price = getMarketPrice(currency);
  const value = amount * price;
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
