import type { CategorizeTransactionsOutput } from '@/ai/flows/categorize-transactions';

export type CategorizedTransaction = CategorizeTransactionsOutput['categorizedTransactions'][0];

export type TransactionCategory = CategorizedTransaction['category'];

export const ALL_CATEGORIES: TransactionCategory[] = [
    "staking rewards",
    "airdrop",
    "salary",
    "trading profit",
    "withdrawal",
    "transfer",
    "payment",
    "trading loss",
];
