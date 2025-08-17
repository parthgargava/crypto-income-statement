'use server';

import { categorizeTransactions, type CategorizeTransactionsInput } from '@/ai/flows/categorize-transactions';
import { CategorizeTransactionsOutput } from '@/ai/flows/categorize-transactions';
import { mockTransactions } from '@/lib/mock-data';

export async function getCategorizedTransactions(input: CategorizeTransactionsInput): Promise<{ success: boolean; data?: CategorizeTransactionsOutput['categorizedTransactions']; error?: string }> {
    try {
        // Check if API key is available
        if (!process.env.GOOGLE_AI_API_KEY) {
            console.warn('Using mock data because GOOGLE_AI_API_KEY is not set');
            // Return mock data as fallback
            return { 
                success: true, 
                data: mockTransactions.map(t => ({
                    ...t,
                    category: t.category || 'staking rewards',
                    type: t.type || 'inflow'
                }))
            };
        }

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
                error: 'Gemini API key not configured. Please set GOOGLE_AI_API_KEY in your .env.local file. Get your key from: https://makersuite.google.com/app/apikey' 
            };
        }
        
        const error = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { success: false, error: `Failed to categorize transactions: ${error}` };
    }
}
