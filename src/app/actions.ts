'use server';

import { categorizeTransactions, type CategorizeTransactionsInput } from '@/ai/flows/categorize-transactions';
import { CategorizeTransactionsOutput } from '@/ai/flows/categorize-transactions';
import { mockTransactions } from '@/lib/mock-data';

export async function getCategorizedTransactions(input: CategorizeTransactionsInput): Promise<{ success: boolean; data?: CategorizeTransactionsOutput['categorizedTransactions']; error?: string }> {
    try {
        // Check if API key is available
        if (!process.env.GOOGLE_AI_API_KEY && !process.env.GROK_API_KEY) {
            console.warn('Using mock data because no AI API key is set');
            // Return mock data as fallback
            return { 
                success: true, 
                data: mockTransactions.map(t => ({
                    ...t,
                    category: 'staking rewards',
                    type: 'inflow' as const
                }))
            };
        }

        // Debug: Log the input structure
        console.log('AI Input transactions count:', input.transactions.length);
        console.log('AI Input sample transaction:', input.transactions[0]);
        
        const result = await categorizeTransactions(input);
        if (!result || !result.categorizedTransactions) {
            return { success: false, error: 'AI categorization returned an invalid format.' };
        }
        return { success: true, data: result.categorizedTransactions };
    } catch (e) {
        console.error('Error categorizing transactions:', e);
        
        // If it's an API key error, provide helpful message
        if (e instanceof Error && e.message.includes('API key')) {
            return { 
                success: false, 
                error: 'AI API key not configured. Please set either GOOGLE_AI_API_KEY or GROK_API_KEY in your .env.local file.' 
            };
        }
        
        // If it's a token limit error, provide specific guidance
        if (e instanceof Error && e.message.includes('token count') && e.message.includes('exceeds')) {
            return { 
                success: false, 
                error: 'Too many transactions for AI processing. The wallet has too many transactions. Try a wallet with fewer transactions or use the file upload feature with a smaller dataset.' 
            };
        }
        
        // If it's a schema validation error, provide fallback categorization
        if (e instanceof Error && (e.message.includes('Schema') || e.message.includes('INVALID_ARGUMENT'))) {
            console.warn('AI schema validation failed, using fallback categorization');
            return {
                success: true,
                data: input.transactions.map(tx => ({
                    ...tx,
                    category: tx.amount > 0 ? 'trading profit' : 'transfer',
                    type: tx.amount > 0 ? 'inflow' as const : 'outflow' as const
                }))
            };
        }
        
        const error = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { success: false, error: `Failed to categorize transactions: ${error}` };
    }
}
