'use server';

import { fetchBlockchainTransactions, fetchEthereumBalance, fetchBitcoinBalance, type BlockchainTransaction } from '@/lib/blockchain-apis';
import { detectCryptoType } from '@/lib/utils';
import type { CategorizeTransactionsInput } from '@/ai/flows/categorize-transactions';

export interface FetchTransactionsInput {
  walletAddress: string;
}

export interface FetchTransactionsOutput {
  success: boolean;
  data?: CategorizeTransactionsInput['transactions'];
  error?: string;
  cryptoType?: string;
  transactionCount?: number;
  balance?: { balance: number; currency: string };
}

/**
 * Fetches real blockchain transactions for a given wallet address
 */
export async function fetchWalletTransactions(input: FetchTransactionsInput): Promise<FetchTransactionsOutput> {
  try {
    const { walletAddress } = input;
    
    if (!walletAddress || !walletAddress.trim()) {
      return { success: false, error: 'Wallet address is required' };
    }

    // Detect the cryptocurrency type from the address
    const cryptoType = detectCryptoType(walletAddress);
    if (!cryptoType) {
      return { success: false, error: 'Unable to detect cryptocurrency type from wallet address' };
    }

    console.log(`Fetching ${cryptoType} transactions for address: ${walletAddress}`);

    // Fetch transactions from the blockchain
    const result = await fetchBlockchainTransactions(walletAddress, cryptoType);
    
    if (!result.success || !result.data) {
      return { 
        success: false, 
        error: result.error || 'Failed to fetch transactions',
        cryptoType 
      };
    }

    // Convert blockchain transactions to the format expected by the AI categorizer
    let transactions = result.data.map((tx: BlockchainTransaction) => ({
      date: tx.date,
      description: tx.description,
      amount: tx.amount,
      currency: tx.currency
    }));

    console.log(`Successfully fetched ${transactions.length} ${cryptoType} transactions`);

    // Optimize: transactions are already filtered at API level, just limit if needed
    const MAX_TRANSACTIONS = 7000;
    
    if (transactions.length > MAX_TRANSACTIONS) {
      console.log(`Limiting transactions from ${transactions.length} to ${MAX_TRANSACTIONS} most recent transactions`);
      transactions = transactions.slice(0, MAX_TRANSACTIONS);
    }

    // Fetch balance for supported cryptocurrencies
    let balance;
    if (cryptoType === 'ETH') {
      const balanceResult = await fetchEthereumBalance(walletAddress);
      if (balanceResult.success && balanceResult.data) {
        balance = balanceResult.data;
        console.log(`Current ${cryptoType} balance: ${balance.balance} ${balance.currency}`);
      }
    } else if (cryptoType === 'BTC') {
      const balanceResult = await fetchBitcoinBalance(walletAddress);
      if (balanceResult.success && balanceResult.data) {
        balance = balanceResult.data;
        console.log(`Current ${cryptoType} balance: ${balance.balance} ${balance.currency}`);
      }
    }

    return {
      success: true,
      data: transactions,
      cryptoType,
      transactionCount: transactions.length,
      balance
    };

  } catch (error) {
    console.error('Error fetching wallet transactions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred while fetching transactions'
    };
  }
}

/**
 * Validates a wallet address and returns the detected cryptocurrency type
 */
export async function validateWalletAddress(address: string): Promise<{ valid: boolean; cryptoType?: string; error?: string }> {
  try {
    if (!address || !address.trim()) {
      return { valid: false, error: 'Wallet address is required' };
    }

    const cryptoType = detectCryptoType(address);
    if (!cryptoType) {
      return { valid: false, error: 'Unable to detect cryptocurrency type from wallet address' };
    }

    return { valid: true, cryptoType };
  } catch (error) {
    return { 
      valid: false, 
      error: error instanceof Error ? error.message : 'Error validating wallet address' 
    };
  }
}
