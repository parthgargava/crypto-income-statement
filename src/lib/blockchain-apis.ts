// Blockchain API services for fetching transactions
// Using free APIs that don't require authentication for basic usage
import { apiCache, getCacheKey } from './cache';

export interface BlockchainTransaction {
  hash: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  from?: string;
  to?: string;
  fee?: number;
  confirmations?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Bitcoin API using BlockCypher with API key
export async function fetchBitcoinTransactions(address: string): Promise<ApiResponse<BlockchainTransaction[]>> {
  try {
    // Check cache first
    const cacheKey = getCacheKey('BTC', address);
    const cached = apiCache.get<ApiResponse<BlockchainTransaction[]>>(cacheKey);
    if (cached) {
      console.log(`Bitcoin: Using cached data for ${address}`);
      return cached;
    }

    const apiKey = process.env.BLOCKCYPHER_API_KEY || '4f328ee304f54949a1eff798d55f0d1a';
    
    // Use a more efficient endpoint that limits results with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${address}/full?limit=7000&token=${apiKey}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Bitcoin API error response:', errorText);
      throw new Error(`Bitcoin API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    // Debug: Log the response structure
    console.log('Bitcoin API response structure:', {
      hasTxs: !!data.txs,
      txsIsArray: Array.isArray(data.txs),
      txsLength: data.txs?.length,
      responseKeys: Object.keys(data)
    });
    
    if (!data.txs || !Array.isArray(data.txs)) {
      console.error('Bitcoin API invalid response:', data);
      
      // Check if it's an error response
      if (data.error) {
        return { success: false, error: `Bitcoin API error: ${data.error}` };
      }
      
      // Check if we got a basic response instead of full
      if (data.txrefs && Array.isArray(data.txrefs)) {
        console.log('Got basic response, using txrefs instead of txs');
        // Convert txrefs to our format
        const transactions: BlockchainTransaction[] = data.txrefs.map((txref: any) => ({
          hash: txref.tx_hash,
          date: new Date(txref.confirmed).toISOString().split('T')[0],
          description: txref.tx_input_n >= 0 ? 'Received' : 'Sent',
          amount: txref.value / 100000000, // Convert from satoshis
          currency: 'BTC',
          from: txref.tx_input_n >= 0 ? 'unknown' : address,
          to: txref.tx_input_n >= 0 ? address : 'unknown',
          fee: undefined,
          confirmations: txref.confirmations
        })).filter((tx: BlockchainTransaction) => tx.amount !== 0);
        
        const result = { success: true, data: transactions };
        apiCache.set(cacheKey, result, 5 * 60 * 1000);
        return result;
      }
      
      return { success: false, error: `Invalid response format from Bitcoin API. Expected 'txs' array, got: ${JSON.stringify(Object.keys(data))}` };
    }

    // Limit to most recent transactions for faster processing
    const recentTxs = data.txs.slice(0, 7000);

    const transactions: BlockchainTransaction[] = recentTxs.map((tx: any) => {
      try {
        // Calculate net amount for this address
        let netAmount = 0;
        const inputs = tx.inputs || [];
        const outputs = tx.outputs || [];

        // Check if this address is in inputs (sending)
        const isSender = inputs.some((input: any) => 
          input.addresses && input.addresses.includes(address)
        );

        // Check if this address is in outputs (receiving)
        const isReceiver = outputs.some((output: any) => 
          output.addresses && output.addresses.includes(address)
        );

        if (isSender && isReceiver) {
          // Self-transfer or change
          const sentAmount = inputs
            .filter((input: any) => input.addresses && input.addresses.includes(address))
            .reduce((sum: number, input: any) => sum + (input.value || 0), 0);
          
          const receivedAmount = outputs
            .filter((output: any) => output.addresses && output.addresses.includes(address))
            .reduce((sum: number, output: any) => sum + (output.value || 0), 0);
          
          netAmount = (receivedAmount - sentAmount) / 100000000; // Convert from satoshis
        } else if (isSender) {
          // Sending transaction
          const sentAmount = outputs
            .filter((output: any) => !output.addresses || !output.addresses.includes(address))
            .reduce((sum: number, output: any) => sum + (output.value || 0), 0);
          netAmount = -(sentAmount / 100000000); // Convert from satoshis
        } else if (isReceiver) {
          // Receiving transaction
          const receivedAmount = outputs
            .filter((output: any) => output.addresses && output.addresses.includes(address))
            .reduce((sum: number, output: any) => sum + (output.value || 0), 0);
          netAmount = receivedAmount / 100000000; // Convert from satoshis
        }

        return {
          hash: tx.hash,
          date: new Date(tx.received).toISOString().split('T')[0],
          description: isSender ? `Sent to ${outputs.find((o: any) => !o.addresses?.includes(address))?.addresses?.[0] || 'unknown'}` : 
                                 `Received from ${inputs.find((i: any) => i.addresses && !i.addresses.includes(address))?.addresses?.[0] || 'unknown'}`,
          amount: netAmount,
          currency: 'BTC',
          from: isSender ? address : inputs.find((i: any) => i.addresses && !i.addresses.includes(address))?.addresses?.[0],
          to: isReceiver ? address : outputs.find((o: any) => !o.addresses?.includes(address))?.addresses?.[0],
          fee: tx.fees ? tx.fees / 100000000 : undefined,
          confirmations: tx.confirmations
        };
      } catch (error) {
        console.error('Error processing Bitcoin transaction:', error, 'Transaction:', tx);
        return null;
      }
    }).filter((tx: BlockchainTransaction | null): tx is BlockchainTransaction => 
      tx !== null && tx.amount !== 0
    ); // Filter out null and zero-amount transactions

    console.log(`Bitcoin: Found ${transactions.length} transactions with money movement out of ${recentTxs.length} recent transactions`);

    const result = { success: true, data: transactions };
    
    // Cache the result
    apiCache.set(cacheKey, result, 5 * 60 * 1000); // 5 minutes cache

    return result;
  } catch (error) {
    console.error('Bitcoin API error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch Bitcoin transactions' 
    };
  }
}

// Ethereum API using Etherscan with API key
export async function fetchEthereumTransactions(address: string): Promise<ApiResponse<BlockchainTransaction[]>> {
  try {
    // Check cache first
    const cacheKey = getCacheKey('ETH', address);
    const cached = apiCache.get<ApiResponse<BlockchainTransaction[]>>(cacheKey);
    if (cached) {
      console.log(`Ethereum: Using cached data for ${address}`);
      return cached;
    }

    const apiKey = process.env.ETHERSCAN_API_KEY || 'E61BD49NRPF6WKJYJZMR7EBIYK87F6NKHC';
    const baseUrl = 'https://api.etherscan.io/api';
    
    // Fetch normal transactions with limited range for faster response
    const txParams = new URLSearchParams({
      module: 'account',
      action: 'txlist',
      address: address,
      startblock: '0',
      endblock: '99999999',
      sort: 'desc',
      offset: '7000', // Limit to 7000 most recent transactions
      apikey: apiKey
    });

    // Fetch internal transactions (contract interactions) with limited range
    const internalParams = new URLSearchParams({
      module: 'account',
      action: 'txlistinternal',
      address: address,
      startblock: '0',
      endblock: '99999999',
      sort: 'desc',
      offset: '3000', // Limit to 3000 most recent internal transactions
      apikey: apiKey
    });

    // Fetch both normal and internal transactions in parallel for faster response with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const [txResponse, internalResponse] = await Promise.all([
      fetch(`${baseUrl}?${txParams}`, { signal: controller.signal }),
      fetch(`${baseUrl}?${internalParams}`, { signal: controller.signal })
    ]);
    clearTimeout(timeoutId);
    
    if (!txResponse.ok) {
      throw new Error(`Ethereum API error: ${txResponse.status} ${txResponse.statusText}`);
    }

    const txData = await txResponse.json();
    
    if (txData.status !== '1' || !txData.result || !Array.isArray(txData.result)) {
      return { success: false, error: txData.message || 'Invalid response format from Ethereum API' };
    }

    let internalData = { result: [] };
    
    if (internalResponse.ok) {
      const internalResult = await internalResponse.json();
      if (internalResult.status === '1' && internalResult.result) {
        internalData = internalResult;
      }
    }

    // Process normal transactions
    const normalTransactions: BlockchainTransaction[] = txData.result.map((tx: any) => {
      const isIncoming = tx.to.toLowerCase() === address.toLowerCase();
      const amount = parseFloat(tx.value) / Math.pow(10, 18); // Convert from wei to ETH

      return {
        hash: tx.hash,
        date: new Date(parseInt(tx.timeStamp) * 1000).toISOString().split('T')[0],
        description: isIncoming ? `Received from ${tx.from}` : `Sent to ${tx.to}`,
        amount: isIncoming ? amount : -amount,
        currency: 'ETH',
        from: tx.from,
        to: tx.to,
        fee: parseFloat(tx.gasPrice) * parseFloat(tx.gasUsed) / Math.pow(10, 18),
        confirmations: parseInt(tx.confirmations)
      };
    });

    // Process internal transactions
    const internalTransactions: BlockchainTransaction[] = internalData.result.map((tx: any) => {
      const isIncoming = tx.to.toLowerCase() === address.toLowerCase();
      const amount = parseFloat(tx.value) / Math.pow(10, 18); // Convert from wei to ETH

      return {
        hash: tx.hash,
        date: new Date(parseInt(tx.timeStamp) * 1000).toISOString().split('T')[0],
        description: isIncoming ? `Internal transfer received from ${tx.from}` : `Internal transfer sent to ${tx.to}`,
        amount: isIncoming ? amount : -amount,
        currency: 'ETH',
        from: tx.from,
        to: tx.to,
        fee: 0, // Internal transactions don't have separate fees
        confirmations: parseInt(tx.confirmations)
      };
    });

    // Combine and sort all transactions by date
    const allTransactions = [...normalTransactions, ...internalTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    console.log(`Fetched ${normalTransactions.length} normal and ${internalTransactions.length} internal Ethereum transactions`);

    // Filter out zero-amount transactions
    const meaningfulTransactions = allTransactions.filter(tx => tx.amount !== 0);
    console.log(`Ethereum: Found ${meaningfulTransactions.length} transactions with money movement out of ${allTransactions.length} total transactions`);

    const result = { success: true, data: meaningfulTransactions };
    
    // Cache the result
    apiCache.set(cacheKey, result, 5 * 60 * 1000); // 5 minutes cache

    return result;
  } catch (error) {
    console.error('Ethereum API error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch Ethereum transactions' 
    };
  }
}

// Solana API using Solscan (free tier)
export async function fetchSolanaTransactions(address: string): Promise<ApiResponse<BlockchainTransaction[]>> {
  try {
    // Check cache first
    const cacheKey = getCacheKey('SOL', address);
    const cached = apiCache.get<ApiResponse<BlockchainTransaction[]>>(cacheKey);
    if (cached) {
      console.log(`Solana: Using cached data for ${address}`);
      return cached;
    }

    const response = await fetch(`https://public-api.solscan.io/account/transactions?account=${address}&limit=7000`);
    
    if (!response.ok) {
      throw new Error(`Solana API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      return { success: false, error: 'Invalid response format from Solana API' };
    }

    const transactions: BlockchainTransaction[] = data.data
      .filter((tx: any) => tx.status === 'Success' && tx.blockTime)
      .map((tx: any) => {
        // Parse transaction details
        const preBalances = tx.meta?.preBalances || [];
        const postBalances = tx.meta?.postBalances || [];
        const accountIndex = tx.transaction?.message?.accountKeys?.findIndex((key: string) => key === address) || -1;
        
        let netAmount = 0;
        if (accountIndex >= 0 && preBalances[accountIndex] !== undefined && postBalances[accountIndex] !== undefined) {
          netAmount = (postBalances[accountIndex] - preBalances[accountIndex]) / Math.pow(10, 9); // Convert from lamports to SOL
        }

        // Determine if it's incoming or outgoing
        const isIncoming = netAmount > 0;
        
        return {
          hash: tx.txHash,
          date: new Date(tx.blockTime * 1000).toISOString().split('T')[0],
          description: isIncoming ? 'Received SOL' : 'Sent SOL',
          amount: netAmount,
          currency: 'SOL',
          from: isIncoming ? 'unknown' : address,
          to: isIncoming ? address : 'unknown',
          fee: tx.meta?.fee ? tx.meta.fee / Math.pow(10, 9) : undefined,
          confirmations: 1 // Solana transactions are typically confirmed quickly
        };
      })
      .filter((tx: BlockchainTransaction) => tx.amount !== 0); // Filter out zero-amount transactions

    console.log(`Solana: Found ${transactions.length} transactions with money movement out of ${data.data.length} total transactions`);

    const result = { success: true, data: transactions };
    
    // Cache the result
    apiCache.set(cacheKey, result, 5 * 60 * 1000); // 5 minutes cache

    return result;
  } catch (error) {
    console.error('Solana API error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch Solana transactions' 
    };
  }
}

// Main function to fetch transactions based on cryptocurrency type
export async function fetchBlockchainTransactions(address: string, cryptoType: string): Promise<ApiResponse<BlockchainTransaction[]>> {
  switch (cryptoType.toUpperCase()) {
    case 'BTC':
      return await fetchBitcoinTransactions(address);
    case 'ETH':
      return await fetchEthereumTransactions(address);
    case 'SOL':
      return await fetchSolanaTransactions(address);
    default:
      return { success: false, error: `Unsupported cryptocurrency: ${cryptoType}` };
  }
}

// Function to fetch Ethereum balance
export async function fetchEthereumBalance(address: string): Promise<ApiResponse<{ balance: number; currency: string }>> {
  try {
    const apiKey = process.env.ETHERSCAN_API_KEY || 'E61BD49NRPF6WKJYJZMR7EBIYK87F6NKHC';
    const baseUrl = 'https://api.etherscan.io/api';
    
    const params = new URLSearchParams({
      module: 'account',
      action: 'balance',
      address: address,
      tag: 'latest',
      apikey: apiKey
    });

    const response = await fetch(`${baseUrl}?${params}`);
    
    if (!response.ok) {
      throw new Error(`Ethereum balance API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status !== '1' || !data.result) {
      return { success: false, error: data.message || 'Invalid response format from Ethereum balance API' };
    }

    const balance = parseFloat(data.result) / Math.pow(10, 18); // Convert from wei to ETH

    return { 
      success: true, 
      data: { 
        balance, 
        currency: 'ETH' 
      } 
    };
  } catch (error) {
    console.error('Ethereum balance API error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch Ethereum balance' 
    };
  }
}

// Bitcoin balance API using BlockCypher
export async function fetchBitcoinBalance(address: string): Promise<ApiResponse<{ balance: number; currency: string }>> {
  try {
    const apiKey = process.env.BLOCKCYPHER_API_KEY || '4f328ee304f54949a1eff798d55f0d1a';
    
    const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance?token=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`Bitcoin balance API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.final_balance && data.final_balance !== 0) {
      return { success: false, error: 'Invalid response format from Bitcoin balance API' };
    }

    const balance = data.final_balance / Math.pow(10, 8); // Convert from satoshis to BTC
    
    return { success: true, data: { balance, currency: 'BTC' } };
  } catch (error) {
    console.error('Bitcoin balance API error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch Bitcoin balance' 
    };
  }
}
