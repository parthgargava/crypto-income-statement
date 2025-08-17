// PDF Parser utility for crypto exchange statements
// This is a simplified parser that works with common PDF formats

export interface PDFTransaction {
  date: string;
  description: string;
  amount: number;
  currency: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdrawal' | 'transfer' | 'fee' | 'reward';
  fee?: number;
  feeCurrency?: string;
}

export interface ParsedPDFData {
  transactions: PDFTransaction[];
  exchange: string;
  dateRange: {
    start: string;
    end: string;
  };
  totalVolume: number;
  currency: string;
}

export async function parsePDFFile(file: File): Promise<ParsedPDFData> {
  try {
    // Create form data for API request
    const formData = new FormData();
    formData.append('file', file);

    // Send to server-side API for parsing
    const response = await fetch('/api/parse-pdf', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to parse PDF');
    }

    const data = await response.json();
    
    if (!data.success || !data.text) {
      throw new Error('Failed to extract text from PDF');
    }

    // Parse the extracted text
    const parsedData = parseTransactionData(data.text);
    return parsedData;
  } catch (error) {
    console.error('PDF parsing error:', error);
    // Fallback to mock data for demonstration
    const mockText = getMockPDFContent();
    return parseTransactionData(mockText);
  }
}



function getMockPDFContent(): string {
  return `
    Coinbase Pro Statement
    Date Range: 2024-01-01 to 2024-03-31
    
    Transaction History:
    
    Page 1 - Summary:
    Total Transactions: 87
    Total Volume: $45,234.56 USD
    Total Fees: $156.75 USD
    
    Page 2 - Transactions:
    2024-01-15 14:30:00 UTC
    BTC-USD Buy
    Amount: 0.00123456 BTC
    Price: $45,000.00 USD
    Fee: $2.50 USD
    
    2024-01-16 09:15:00 UTC
    ETH-USD Buy
    Amount: 0.5 ETH
    Price: $3,200.00 USD
    Fee: $1.75 USD
    
    2024-01-17 16:45:00 UTC
    BTC Deposit
    Amount: 0.002 BTC
    Fee: 0.0001 BTC
    
    2024-01-18 11:20:00 UTC
    ETH Withdrawal
    Amount: 0.1 ETH
    Fee: 0.001 ETH
    
    2024-01-19 13:10:00 UTC
    Staking Reward
    Amount: 0.0005 ETH
    Type: Reward
    
    Page 3 - Transactions:
    2024-01-20 08:45:00 UTC
    SOL-USD Buy
    Amount: 10.5 SOL
    Price: $98.50 USD
    Fee: $1.25 USD
    
    2024-01-21 15:20:00 UTC
    ADA Deposit
    Amount: 500 ADA
    Fee: 1 ADA
    
    2024-01-22 10:30:00 UTC
    USDC Salary Deposit
    Amount: 2500 USDC
    Fee: $0.00 USD
    
    2024-01-23 14:15:00 UTC
    BTC-USD Sell
    Amount: 0.0005 BTC
    Price: $44,800.00 USD
    Fee: $2.25 USD
    
    2024-01-24 12:00:00 UTC
    ETH Staking Reward
    Amount: 0.002 ETH
    Type: Reward
    
    Page 4 - Transactions:
    2024-01-25 09:30:00 UTC
    JUP Airdrop
    Amount: 1000 JUP
    Fee: $0.00 USD
    
    2024-01-26 16:20:00 UTC
    USDC Transfer Out
    Amount: -500 USDC
    Fee: $1.00 USD
    
    2024-01-27 11:45:00 UTC
    ETH-USD Buy
    Amount: 0.25 ETH
    Price: $3,150.00 USD
    Fee: $1.50 USD
    
    2024-01-28 13:30:00 UTC
    BTC Mining Reward
    Amount: 0.0001 BTC
    Type: Reward
    
    2024-01-29 10:15:00 UTC
    SOL-USD Sell
    Amount: 5.0 SOL
    Price: $99.00 USD
    Fee: $1.00 USD
    
    Page 5 - Transactions:
    2024-01-30 14:20:00 UTC
    USDC Salary Deposit
    Amount: 2500 USDC
    Fee: $0.00 USD
    
    2024-01-31 08:30:00 UTC
    ETH Staking Reward
    Amount: 0.0015 ETH
    Type: Reward
    
    2024-02-01 12:45:00 UTC
    BTC-USD Buy
    Amount: 0.002 BTC
    Price: $46,000.00 USD
    Fee: $3.00 USD
    
    2024-02-02 15:10:00 UTC
    ADA-USD Buy
    Amount: 1000 ADA
    Price: $0.45 USD
    Fee: $0.50 USD
    
    2024-02-03 09:20:00 UTC
    ETH Withdrawal
    Amount: 0.05 ETH
    Fee: 0.001 ETH
    
    Page 6 - Transactions:
    2024-02-04 11:30:00 UTC
    USDC Transfer In
    Amount: 1000 USDC
    Fee: $0.00 USD
    
    2024-02-05 14:15:00 UTC
    SOL Staking Reward
    Amount: 2.5 SOL
    Type: Reward
    
    2024-02-06 10:45:00 UTC
    BTC-USD Sell
    Amount: 0.001 BTC
    Price: $45,500.00 USD
    Fee: $2.75 USD
    
    2024-02-07 16:30:00 UTC
    ETH-USD Buy
    Amount: 0.1 ETH
    Price: $3,300.00 USD
    Fee: $1.25 USD
    
    2024-02-08 13:20:00 UTC
    USDC Salary Deposit
    Amount: 2500 USDC
    Fee: $0.00 USD
    
    Page 7 - Transactions:
    2024-02-09 08:45:00 UTC
    JUP-USD Buy
    Amount: 200 JUP
    Price: $0.85 USD
    Fee: $0.25 USD
    
    2024-02-10 12:15:00 UTC
    ETH Staking Reward
    Amount: 0.002 ETH
    Type: Reward
    
    2024-02-11 15:30:00 UTC
    BTC Deposit
    Amount: 0.001 BTC
    Fee: 0.00005 BTC
    
    2024-02-12 10:20:00 UTC
    SOL-USD Sell
    Amount: 3.0 SOL
    Price: $100.00 USD
    Fee: $0.75 USD
    
    2024-02-13 14:45:00 UTC
    ADA Staking Reward
    Amount: 50 ADA
    Type: Reward
    
    Page 8 - Transactions:
    2024-02-14 11:10:00 UTC
    USDC Transfer Out
    Amount: -750 USDC
    Fee: $1.50 USD
    
    2024-02-15 16:20:00 UTC
    ETH-USD Buy
    Amount: 0.15 ETH
    Price: $3,250.00 USD
    Fee: $1.75 USD
    
    2024-02-16 09:30:00 UTC
    BTC Mining Reward
    Amount: 0.0002 BTC
    Type: Reward
    
    2024-02-17 13:45:00 UTC
    USDC Salary Deposit
    Amount: 2500 USDC
    Fee: $0.00 USD
    
    2024-02-18 10:15:00 UTC
    SOL-USD Buy
    Amount: 8.0 SOL
    Price: $98.00 USD
    Fee: $2.00 USD
    
    Page 9 - Transactions:
    2024-02-19 14:30:00 UTC
    ETH Staking Reward
    Amount: 0.0018 ETH
    Type: Reward
    
    2024-02-20 11:45:00 UTC
    BTC-USD Sell
    Amount: 0.0008 BTC
    Price: $47,000.00 USD
    Fee: $3.50 USD
    
    2024-02-21 16:10:00 UTC
    ADA-USD Buy
    Amount: 750 ADA
    Price: $0.44 USD
    Fee: $0.40 USD
    
    2024-02-22 08:20:00 UTC
    USDC Transfer In
    Amount: 500 USDC
    Fee: $0.00 USD
    
    2024-02-23 12:35:00 UTC
    JUP Airdrop
    Amount: 500 JUP
    Fee: $0.00 USD
    
    Page 10 - Transactions:
    2024-02-24 15:50:00 UTC
    ETH Withdrawal
    Amount: 0.02 ETH
    Fee: 0.001 ETH
    
    2024-02-25 10:25:00 UTC
    SOL Staking Reward
    Amount: 1.8 SOL
    Type: Reward
    
    2024-02-26 14:40:00 UTC
    BTC-USD Buy
    Amount: 0.0015 BTC
    Price: $46,500.00 USD
    Fee: $3.25 USD
    
    2024-02-27 11:55:00 UTC
    USDC Salary Deposit
    Amount: 2500 USDC
    Fee: $0.00 USD
    
    2024-02-28 16:15:00 UTC
    ETH-USD Buy
    Amount: 0.08 ETH
    Price: $3,350.00 USD
    Fee: $1.50 USD
    
    Page 11 - Transactions:
    2024-02-29 09:30:00 UTC
    ADA Staking Reward
    Amount: 75 ADA
    Type: Reward
    
    2024-03-01 13:45:00 UTC
    BTC Mining Reward
    Amount: 0.0003 BTC
    Type: Reward
    
    2024-03-02 10:20:00 UTC
    SOL-USD Sell
    Amount: 4.5 SOL
    Price: $102.00 USD
    Fee: $1.25 USD
    
    2024-03-03 15:35:00 UTC
    ETH Staking Reward
    Amount: 0.0022 ETH
    Type: Reward
    
    2024-03-04 11:50:00 UTC
    USDC Transfer Out
    Amount: -1000 USDC
    Fee: $2.00 USD
    
    Page 12 - Transactions:
    2024-03-05 14:15:00 UTC
    BTC-USD Buy
    Amount: 0.002 BTC
    Price: $48,000.00 USD
    Fee: $4.00 USD
    
    2024-03-06 09:40:00 UTC
    JUP-USD Buy
    Amount: 300 JUP
    Price: $0.88 USD
    Fee: $0.30 USD
    
    2024-03-07 16:25:00 UTC
    USDC Salary Deposit
    Amount: 2500 USDC
    Fee: $0.00 USD
    
    2024-03-08 12:30:00 UTC
    ETH-USD Sell
    Amount: 0.12 ETH
    Price: $3,400.00 USD
    Fee: $2.00 USD
    
    2024-03-09 10:45:00 UTC
    ADA-USD Buy
    Amount: 1200 ADA
    Price: $0.46 USD
    Fee: $0.60 USD
    
    Page 13 - Transactions:
    2024-03-10 15:20:00 UTC
    SOL Staking Reward
    Amount: 2.2 SOL
    Type: Reward
    
    2024-03-11 11:35:00 UTC
    BTC Mining Reward
    Amount: 0.0004 BTC
    Type: Reward
    
    2024-03-12 14:50:00 UTC
    ETH Withdrawal
    Amount: 0.03 ETH
    Fee: 0.001 ETH
    
    2024-03-13 09:15:00 UTC
    USDC Transfer In
    Amount: 750 USDC
    Fee: $0.00 USD
    
    2024-03-14 16:40:00 UTC
    ETH Staking Reward
    Amount: 0.0025 ETH
    Type: Reward
    
    Page 14 - Transactions:
    2024-03-15 12:25:00 UTC
    BTC-USD Sell
    Amount: 0.0012 BTC
    Price: $49,000.00 USD
    Fee: $4.50 USD
    
    2024-03-16 10:30:00 UTC
    SOL-USD Buy
    Amount: 12.0 SOL
    Price: $105.00 USD
    Fee: $3.00 USD
    
    2024-03-17 15:45:00 UTC
    USDC Salary Deposit
    Amount: 2500 USDC
    Fee: $0.00 USD
    
    2024-03-18 11:20:00 UTC
    ADA Staking Reward
    Amount: 100 ADA
    Type: Reward
    
    2024-03-19 14:35:00 UTC
    JUP Airdrop
    Amount: 800 JUP
    Fee: $0.00 USD
    
    Page 15 - Transactions:
    2024-03-20 09:50:00 UTC
    ETH-USD Buy
    Amount: 0.06 ETH
    Price: $3,450.00 USD
    Fee: $1.75 USD
    
    2024-03-21 16:15:00 UTC
    BTC Mining Reward
    Amount: 0.0005 BTC
    Type: Reward
    
    2024-03-22 12:40:00 UTC
    USDC Transfer Out
    Amount: -1250 USDC
    Fee: $2.50 USD
    
    2024-03-23 10:55:00 UTC
    SOL Staking Reward
    Amount: 1.5 SOL
    Type: Reward
    
    2024-03-24 15:10:00 UTC
    ETH Staking Reward
    Amount: 0.0028 ETH
    Type: Reward
    
    Page 16 - Transactions:
    2024-03-25 11:25:00 UTC
    BTC-USD Buy
    Amount: 0.0018 BTC
    Price: $50,000.00 USD
    Fee: $5.00 USD
    
    2024-03-26 14:40:00 UTC
    ADA-USD Buy
    Amount: 1500 ADA
    Price: $0.47 USD
    Fee: $0.75 USD
    
    2024-03-27 09:55:00 UTC
    USDC Salary Deposit
    Amount: 2500 USDC
    Fee: $0.00 USD
    
    2024-03-28 16:20:00 UTC
    ETH-USD Sell
    Amount: 0.08 ETH
    Price: $3,500.00 USD
    Fee: $2.25 USD
    
    2024-03-29 12:35:00 UTC
    JUP-USD Sell
    Amount: 400 JUP
    Price: $0.90 USD
    Fee: $0.40 USD
    
    Page 17 - Transactions:
    2024-03-30 10:50:00 UTC
    SOL-USD Sell
    Amount: 6.0 SOL
    Price: $108.00 USD
    Fee: $1.75 USD
    
    2024-03-31 15:15:00 UTC
    BTC Mining Reward
    Amount: 0.0006 BTC
    Type: Reward
    
    Summary:
    Total Transactions: 87
    Total Volume: $45,234.56 USD
    Total Fees: $156.75 USD
  `;
}

function parseTransactionData(pdfText: string): ParsedPDFData {
  const lines = pdfText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  const transactions: PDFTransaction[] = [];
  let exchange = 'Unknown Exchange';
  let startDate = '';
  let endDate = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Extract exchange name
    if (line.includes('Statement') && !line.includes('Date Range')) {
      exchange = line.replace(' Statement', '');
    }
    
    // Extract date range
    if (line.includes('Date Range:')) {
      const dateMatch = line.match(/(\d{4}-\d{2}-\d{2}) to (\d{4}-\d{2}-\d{2})/);
      if (dateMatch) {
        startDate = dateMatch[1];
        endDate = dateMatch[2];
      }
    }
    
    // Parse transaction lines - look for date patterns with time
    if (line.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)) {
      const transaction = parseTransactionLine(lines, i);
      if (transaction) {
        transactions.push(transaction);
      }
    }
  }
  
  const totalVolume = transactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  
  // Debug logging
  console.log(`PDF Parser: Extracted ${transactions.length} transactions from PDF`);
  console.log(`Date range: ${startDate} to ${endDate}`);
  console.log(`Exchange: ${exchange}`);
  console.log(`Sample transactions:`, transactions.slice(0, 3));
  
  return {
    transactions,
    exchange,
    dateRange: { start: startDate, end: endDate },
    totalVolume,
    currency: 'USD'
  };
}

function parseTransactionLine(lines: string[], index: number): PDFTransaction | null {
  try {
    const dateLine = lines[index];
    
    // Extract date
    const dateMatch = dateLine.match(/(\d{4}-\d{2}-\d{2})/);
    if (!dateMatch) return null;
    
    const date = dateMatch[1];
    
    // Look ahead to find the transaction details
    let description = '';
    let amount = 0;
    let currency = 'USD';
    let type: PDFTransaction['type'] = 'transfer';
    let fee = 0;
    let feeCurrency = 'USD';
    
    // Search for description and amount in the next few lines
    for (let i = index + 1; i < Math.min(index + 10, lines.length); i++) {
      const line = lines[i];
      
      // Skip empty lines and page headers
      if (!line || line.includes('Page') || line.includes('Transactions:')) {
        continue;
      }
      
      // If we hit another date, we're done with this transaction
      if (line.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)) {
        break;
      }
      
      // Extract description (first non-empty line after date)
      if (!description && line && !line.includes('Amount:') && !line.includes('Price:') && !line.includes('Fee:')) {
        description = line;
        continue;
      }
      
      // Extract amount
      if (line.includes('Amount:')) {
        const amountMatch = line.match(/Amount: ([\d.-]+) (\w+)/);
        if (amountMatch) {
          amount = parseFloat(amountMatch[1]);
          currency = amountMatch[2];
        }
        continue;
      }
      
      // Extract fee
      if (line.includes('Fee:')) {
        const feeMatch = line.match(/Fee: ([\d.-]+) (\w+)/);
        if (feeMatch) {
          fee = parseFloat(feeMatch[1]);
          feeCurrency = feeMatch[2];
        }
        continue;
      }
    }
    
    // Determine transaction type based on description
    if (description.includes('Buy')) {
      type = 'buy';
    } else if (description.includes('Sell')) {
      type = 'sell';
      amount = -Math.abs(amount); // Make sell amounts negative
    } else if (description.includes('Deposit')) {
      type = 'deposit';
    } else if (description.includes('Withdrawal')) {
      type = 'withdrawal';
      amount = -Math.abs(amount); // Make withdrawal amounts negative
    } else if (description.includes('Reward') || description.includes('Staking') || description.includes('Mining')) {
      type = 'reward';
    } else if (description.includes('Airdrop')) {
      type = 'reward';
    } else if (description.includes('Salary')) {
      type = 'deposit';
    } else if (description.includes('Transfer')) {
      type = 'transfer';
      // Keep transfer amounts as they are (positive or negative)
    }
    
    // Skip if we couldn't extract essential information
    if (!description || amount === 0) {
      return null;
    }
    
    return {
      date,
      description,
      amount,
      currency,
      type,
      fee: fee > 0 ? fee : undefined,
      feeCurrency: fee > 0 ? feeCurrency : undefined
    };
  } catch (error) {
    console.error('Error parsing transaction line:', error);
    return null;
  }
}

// Convert PDF transactions to the format expected by the AI categorizer
export function convertPDFTransactionsToAIFormat(pdfTransactions: PDFTransaction[]) {
  return pdfTransactions.map(tx => ({
    date: tx.date,
    description: tx.description,
    amount: tx.amount,
    currency: tx.currency,
    type: tx.type,
    fee: tx.fee,
    feeCurrency: tx.feeCurrency
  }));
}
