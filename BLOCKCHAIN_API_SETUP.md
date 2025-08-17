# Blockchain API Setup Guide

This guide explains how to set up and use the live blockchain APIs for fetching real cryptocurrency transactions.

## Supported Cryptocurrencies

The application now supports live transaction fetching for:

- **Bitcoin (BTC)** - Using BlockCypher API
- **Ethereum (ETH)** - Using Etherscan API  
- **Solana (SOL)** - Using Solscan API

## API Providers & Rate Limits

### Bitcoin - BlockCypher API
- **Provider**: BlockCypher (https://www.blockcypher.com/)
- **Free Tier**: 3 requests/second, 200 requests/hour
- **No API Key Required**: Works out of the box
- **Features**: Full transaction history, balance, unconfirmed transactions

### Ethereum - Etherscan API
- **Provider**: Etherscan (https://etherscan.io/)
- **Free Tier**: 5 requests/second, 100,000 requests/day
- **API Key Required**: Get free API key from Etherscan
- **Features**: Transaction history, token transfers, contract interactions

### Solana - Solscan API
- **Provider**: Solscan (https://public-api.solscan.io/)
- **Free Tier**: No strict limits (reasonable usage)
- **No API Key Required**: Works out of the box
- **Features**: Transaction history, token balances, program interactions

## Setup Instructions

### 1. Etherscan API Key (Configured)

The application is now configured with an Etherscan API key for enhanced Ethereum transaction and balance fetching:

- **API Key**: `E61BD49NRPF6WKJYJZMR7EBIYK87F6NKHC`
- **Features**: Normal transactions, internal transactions, and balance fetching
- **Rate Limits**: 5 requests/second, 100,000 requests/day
- **Enhanced Data**: More comprehensive transaction history including contract interactions

### 2. BlockCypher API Key (Configured)

The application is now configured with a BlockCypher API key for enhanced Bitcoin transaction and balance fetching:

- **API Key**: `4f328ee304f54949a1eff798d55f0d1a`
- **Features**: Bitcoin transactions and balance fetching
- **Rate Limits**: 3 requests/second, 200 requests/hour
- **Enhanced Data**: More reliable Bitcoin transaction history and current balance

### 3. AI API Key (Required for Categorization)

You need either a Gemini or Grok API key for transaction categorization:

#### Option A: Gemini API (Google AI)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a free API key
3. Add to your `.env.local` file

#### Option B: Grok API (X.AI)
1. Go to [X.AI Console](https://console.x.ai/)
2. Create an API key
3. Add to your `.env.local` file

### 4. Environment Variables

Create or update your `.env.local` file:

```bash
# Required for AI categorization (choose one)
GOOGLE_AI_API_KEY=your_gemini_api_key_here
# OR
GROK_API_KEY=your_grok_api_key_here

# Ethereum API key (already configured in code)
ETHERSCAN_API_KEY=E61BD49NRPF6WKJYJZMR7EBIYK87F6NKHC

# Bitcoin API key (already configured in code)
BLOCKCYPHER_API_KEY=4f328ee304f54949a1eff798d55f0d1a
```

## How It Works

### 1. Address Detection
When a user enters a wallet address, the system automatically detects the cryptocurrency type:
- **Bitcoin**: Addresses starting with `1`, `3`, `bc1`, or `tb1`
- **Ethereum**: Addresses starting with `0x` and 42 characters long
- **Solana**: Base58 encoded addresses 32-44 characters long

### 2. Transaction Fetching
Based on the detected cryptocurrency, the system calls the appropriate API:
- **Bitcoin**: Fetches from BlockCypher API
- **Ethereum**: Fetches from Etherscan API (normal + internal transactions)
- **Solana**: Fetches from Solscan API

### 3. Balance Fetching
- **Ethereum**: Fetches current balance using Etherscan API
- **Bitcoin**: Fetches current balance using BlockCypher API
- **Solana**: Balance calculation from transaction history

### 4. Data Processing
Raw blockchain data is processed to:
- Convert amounts to proper decimal places
- Calculate net amounts for each transaction
- Generate human-readable descriptions
- Handle fees and confirmations

### 5. Performance Optimizations
- **API Limits**: Limited to 7000 most recent transactions per API call
- **Parallel Processing**: Ethereum normal and internal transactions fetched simultaneously
- **Caching**: 5-minute cache for API responses to avoid redundant calls
- **Timeouts**: 15-second timeout for all API calls to prevent hanging
- **Smart Filtering**: Zero-amount transactions filtered at API level

### 6. Transaction Filtering & Limiting
- **Money Movement Filter**: Only includes transactions with actual value transfer (non-zero amounts)
- **Safety Limit**: Maximum 7000 meaningful transactions sent to AI
- **Automatic Filtering**: Removes internal transactions with no money movement
- **User Feedback**: Shows total fetched vs meaningful transactions count
- **Token Safety**: Prevents AI token limit errors while preserving important data

### 7. AI Categorization
Fetched transactions are sent to the AI categorizer to:
- Determine transaction type (inflow/outflow)
- Assign categories (staking, airdrop, salary, etc.)
- Generate income summaries
- **Supported AI**: Gemini (Google) or Grok (X.AI)

## Usage Examples

### Test Addresses

You can test the functionality with these public addresses:

**Bitcoin:**
```
1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy
bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4
```

**Ethereum:**
```
0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6
0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
```

**Solana:**
```
9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
11111111111111111111111111111112
```

## Error Handling

The system handles various error scenarios:

- **Invalid Address**: Shows "Unable to detect cryptocurrency type"
- **No Transactions**: Shows "No transactions found for this address"
- **API Rate Limits**: Shows appropriate error messages
- **Network Issues**: Graceful fallback with user-friendly messages

## Rate Limiting & Best Practices

### Free Tier Limits
- **Bitcoin**: 3 req/sec, 200 req/hour
- **Ethereum**: 5 req/sec, 100k req/day (with API key)
- **Solana**: No strict limits (reasonable usage)

### Recommendations
1. **Get an Etherscan API key** for better Ethereum performance
2. **Don't spam requests** - the free tiers are generous but not unlimited
3. **Test with public addresses** first before using your own wallets
4. **Monitor console logs** for API response details

## Troubleshooting

### Common Issues

**"Failed to fetch transactions"**
- Check your internet connection
- Verify the address format is correct
- Try a different address to test

**"No transactions found"**
- The address might be new or unused
- Try a well-known address for testing
- Some addresses might have privacy restrictions

**"API rate limit exceeded"**
- Wait a few minutes before trying again
- Consider getting an API key for better limits
- Use the file upload feature as an alternative

**"Too many transactions for AI processing"**
- The wallet has more than 2000 meaningful transactions
- The system automatically limits to 2000 transactions with money movement for AI processing
- You'll see a message showing total fetched vs meaningful transactions count
- Try a wallet with fewer transactions or use file upload with smaller dataset

**"Token count exceeds maximum"**
- This is now handled automatically with transaction limiting
- If you still see this error, try a different wallet address
- Consider using Grok API which may have different token limits

### Debug Mode

Enable detailed logging by checking the browser console for:
- API request details
- Transaction processing steps
- Error messages and stack traces

## Security Notes

- **Public APIs**: These are public blockchain APIs, no private keys needed
- **Read-Only**: The system only reads transaction data, never sends transactions
- **Address Privacy**: Be aware that blockchain transactions are public
- **API Keys**: Keep your Etherscan API key secure and don't share it

## Future Enhancements

Planned improvements:
- Support for more cryptocurrencies (Cardano, Polkadot, etc.)
- Token transfer detection (ERC-20, SPL tokens)
- DeFi protocol integration
- Real-time price data integration
- Enhanced transaction categorization
