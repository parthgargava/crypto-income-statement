"use client";

import { useState } from "react";
import type { CategorizedTransaction } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { getCategorizedTransactions } from "@/app/actions";
import { fetchWalletTransactions } from "@/app/blockchain-actions";
import { mockTransactions } from "@/lib/mock-data";
import { InputView } from "./input-view";
import { ResultsView } from "./results-view";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent } from "./ui/card";

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categorizedTransactions, setCategorizedTransactions] = useState<CategorizedTransaction[] | null>(null);
  const [walletBalance, setWalletBalance] = useState<{ balance: number; currency: string } | null>(null);
  const { toast } = useToast();

  const handleProcessTransactions = async (walletAddress: string, cryptoType: string) => {
    setIsLoading(true);
    setError(null);
    setCategorizedTransactions(null);
    setWalletBalance(null);

          try {
        let transactions;
        let fetchResult: any = null;

        if (walletAddress && cryptoType) {
          // Fetch real blockchain transactions
          console.log(`Fetching ${cryptoType} transactions for ${walletAddress}`);
          fetchResult = await fetchWalletTransactions({ walletAddress });
          
          if (!fetchResult.success || !fetchResult.data) {
            throw new Error(fetchResult.error || "Failed to fetch blockchain transactions");
          }

          if (fetchResult.data.length === 0) {
            throw new Error(`No transactions found for this ${cryptoType} address`);
          }

          transactions = fetchResult.data;
          console.log(`Fetched ${transactions.length} ${cryptoType} transactions`);
          
          // Store balance information if available
          if (fetchResult.balance) {
            setWalletBalance(fetchResult.balance);
          }
        } else {
          // Use mock data for file upload (demo mode)
          transactions = mockTransactions;
        }

        // Categorize the transactions using AI
        const input = { transactions };
        const result = await getCategorizedTransactions(input);

        if (result.success && result.data) {
          // Sort by date descending
          const sortedData = result.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setCategorizedTransactions(sortedData);
          
          // Show success message
          if (walletAddress && cryptoType && fetchResult) {
            const totalFetched = fetchResult.transactionCount || 0;
            const processedCount = result.data.length;
            const message = totalFetched > processedCount 
              ? `Fetched ${totalFetched} ${cryptoType} transactions, processed ${processedCount} meaningful transactions (filtered for money movement).`
              : `Fetched and categorized ${processedCount} ${cryptoType} transactions.`;
            
            toast({
              title: "Success!",
              description: message,
            });
          }
        } else {
          throw new Error(result.error || "Failed to categorize transactions");
        }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCategorizedTransactions(null);
    setError(null);
    setIsLoading(false);
    setWalletBalance(null);
  };
  
  const handleUpdateTransaction = (updatedTransaction: CategorizedTransaction) => {
    if (!categorizedTransactions) return;
    const newTransactions = categorizedTransactions.map(t => 
        t.description === updatedTransaction.description && t.date === updatedTransaction.date ? updatedTransaction : t
    );
    setCategorizedTransactions(newTransactions);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }
    if (categorizedTransactions) {
      return <ResultsView 
        transactions={categorizedTransactions} 
        onReset={handleReset} 
        onUpdateTransaction={handleUpdateTransaction}
        walletBalance={walletBalance}
      />;
    }
    return <InputView onProcess={handleProcessTransactions} />;
  };

  return <div className="container mx-auto p-4 sm:p-6 md:p-8">{renderContent()}</div>;
}

const LoadingState = () => (
  <div className="space-y-8">
    <div className="text-center">
      <div className="calico-gradient p-4 rounded-full w-16 h-16 mx-auto mb-4 animate-spin">
        <div className="w-full h-full rounded-full bg-white/20"></div>
      </div>
      <h3 className="text-lg font-semibold mb-2">Fetching & Processing Transactions</h3>
      <p className="text-muted-foreground">Please wait while we fetch your blockchain transactions and categorize them...</p>
    </div>
    
    <div className="grid gap-4 md:grid-cols-3">
      <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
      <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
      <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
    </div>
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-96 w-full" />
      </CardContent>
    </Card>
    <div className="grid gap-4 md:grid-cols-2">
       <Card><CardContent className="p-6"><Skeleton className="h-80 w-full" /></CardContent></Card>
       <Card><CardContent className="p-6"><Skeleton className="h-80 w-full" /></CardContent></Card>
    </div>
  </div>
);
