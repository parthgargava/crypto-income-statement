"use client";

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
import type { CategorizedTransaction, TransactionCategory } from "@/types";
import { ALL_CATEGORIES } from "@/types";
import { cn } from "@/lib/utils";
import { CryptoIcon } from "./icons/crypto-icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";


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
  
  const handleCategoryChange = (transaction: CategorizedTransaction, newCategory: TransactionCategory) => {
    const newType = ["staking rewards", "airdrop", "salary", "trading profit"].includes(newCategory) ? "inflow" : "outflow";
    onUpdateTransaction({ ...transaction, category: newCategory, type: newType });
  };

  return (
    <Card className="calico-card overflow-hidden">
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
          {transactions.map((t, index) => (
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
    </Card>
  );
}
