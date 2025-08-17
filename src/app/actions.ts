'use server';

import { categorizeTransactions, type CategorizeTransactionsInput } from '@/ai/flows/categorize-transactions';
import { CategorizeTransactionsOutput } from '@/ai/flows/categorize-transactions';

export async function getCategorizedTransactions(input: CategorizeTransactionsInput): Promise<{ success: boolean; data?: CategorizeTransactionsOutput['categorizedTransactions']; error?: string }> {
    try {
        const result = await categorizeTransactions(input);
        if (!result || !result.categorizedTransactions) {
            return { success: false, error: 'AI categorization returned an invalid format.' };
        }
        return { success: true, data: result.categorizedTransactions };
    } catch (e) {
        console.error('Error categorizing transactions:', e);
        const error = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { success: false, error: `Failed to categorize transactions: ${error}` };
    }
}
