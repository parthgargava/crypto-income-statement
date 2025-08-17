"use client";

import { useState } from "react";
import type { CategorizedTransaction } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { getCategorizedTransactions } from "@/app/actions";
import { mockTransactions } from "@/lib/mock-data";
import { InputView } from "./input-view";
import { ResultsView } from "./results-view";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent } from "./ui/card";

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categorizedTransactions, setCategorizedTransactions] = useState<CategorizedTransaction[] | null>(null);
  const { toast } = useToast();

  const handleProcessTransactions = async () => {
    setIsLoading(true);
    setError(null);
    setCategorizedTransactions(null);

    // In a real app, you'd get the transactions from a file upload or wallet API
    const input = { transactions: mockTransactions };

    const result = await getCategorizedTransactions(input);

    if (result.success && result.data) {
      // Sort by date descending
      const sortedData = result.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setCategorizedTransactions(sortedData);
    } else {
      setError(result.error || "An unknown error occurred.");
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Failed to process transactions.",
      });
    }
    setIsLoading(false);
  };

  const handleReset = () => {
    setCategorizedTransactions(null);
    setError(null);
    setIsLoading(false);
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
      return <ResultsView transactions={categorizedTransactions} onReset={handleReset} onUpdateTransaction={handleUpdateTransaction} />;
    }
    return <InputView onProcess={handleProcessTransactions} />;
  };

  return <div className="container mx-auto p-4 sm:p-6 md:p-8">{renderContent()}</div>;
}

const LoadingState = () => (
  <div className="space-y-8">
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
