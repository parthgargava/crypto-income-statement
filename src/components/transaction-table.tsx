"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CategorizedTransaction, TransactionCategory } from "@/types";
import { ALL_CATEGORIES } from "@/types";
import { cn } from "@/lib/utils";
import { CryptoIcon } from "./icons/crypto-icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";


interface TransactionTableProps {
  transactions: CategorizedTransaction[];
  onUpdateTransaction: (transaction: CategorizedTransaction) => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
    }).format(value);
};


export function TransactionTable({ transactions, onUpdateTransaction }: TransactionTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const itemsPerPage = 20;

  const handleCategoryChange = (transaction: CategorizedTransaction, newCategory: TransactionCategory) => {
    const newType = ["staking rewards", "airdrop", "salary", "trading profit"].includes(newCategory) ? "inflow" : "outflow";
    onUpdateTransaction({ ...transaction, category: newCategory, type: newType });
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.currency.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  return (
    <Card className="calico-card overflow-hidden">
      {/* Search and Filter Controls */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {ALL_CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Results Summary */}
        <div className="mt-3 text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
          {searchTerm && ` matching "${searchTerm}"`}
          {categoryFilter !== "all" && ` in category "${categoryFilter}"`}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-muted/50">
            <TableHead className="text-foreground font-semibold">Date</TableHead>
            <TableHead className="text-foreground font-semibold">Description</TableHead>
            <TableHead className="text-foreground font-semibold">Category</TableHead>
            <TableHead className="text-right text-foreground font-semibold">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentTransactions.map((t, index) => (
            <TableRow key={`${t.date}-${t.description}-${index}`} className="border-border hover:bg-muted/30">
              <TableCell className="font-medium whitespace-nowrap text-foreground">{new Date(t.date).toLocaleDateString()}</TableCell>
              <TableCell className="text-foreground">{t.description}</TableCell>
              <TableCell>
                <Select
                  value={t.category}
                  onValueChange={(value) => handleCategoryChange(t, value as TransactionCategory)}
                >
                  <SelectTrigger className="w-[180px] h-8 text-xs print:border-none print:w-auto print:h-auto print:p-0 bg-background border-border">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {ALL_CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat} className="text-xs text-foreground">{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                    <span className={cn(
                        "font-mono font-semibold",
                        t.type === 'inflow' ? 'text-primary' : 'text-destructive'
                    )}>
                        {t.type === 'inflow' ? '+' : ''}{formatCurrency(t.amount)}
                    </span>
                    <Badge variant={t.type === 'inflow' ? 'default' : 'destructive'} 
                        className={cn("w-16 justify-center print:hidden", 
                          t.type === 'inflow' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-destructive/20 text-destructive border-destructive/30')}>
                        {t.type}
                    </Badge>
                     <CryptoIcon currency={t.currency} className="h-5 w-5" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
