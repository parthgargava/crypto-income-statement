import type { CategorizeTransactionsInput } from '@/ai/flows/categorize-transactions';

export const mockTransactions: CategorizeTransactionsInput['transactions'] = [
  {
    date: '2023-10-26',
    description: 'Received from 0x...def1',
    amount: 0.5,
    currency: 'ETH',
  },
  {
    date: '2023-11-05',
    description: 'Staking Rewards',
    amount: 0.02,
    currency: 'ETH',
  },
  {
    date: '2023-11-15',
    description: 'Coinbase Pro withdrawal',
    amount: -0.2,
    currency: 'ETH',
  },
  {
    date: '2023-11-20',
    description: 'USDC Salary Deposit',
    amount: 2500,
    currency: 'USDC',
  },
  {
    date: '2023-12-01',
    description: 'Sent to 0x...abc2',
    amount: -100,
    currency: 'USDC',
  },
  {
    date: '2023-12-05',
    description: 'Staking Rewards',
    amount: 0.021,
    currency: 'ETH',
  },
  {
    date: '2024-01-05',
    description: 'Staking Rewards',
    amount: 0.022,
    currency: 'ETH',
  },
  {
    date: '2024-01-18',
    description: 'Airdrop: JUP',
    amount: 500,
    currency: 'JUP',
  },
    {
    date: '2024-01-20',
    description: 'USDC Salary Deposit',
    amount: 2500,
    currency: 'USDC',
  },
  {
    date: '2024-02-01',
    description: 'Bought BTC',
    amount: 0.05,
    currency: 'BTC',
  },
    {
    date: '2024-02-05',
    description: 'Staking Rewards',
    amount: 0.023,
    currency: 'ETH',
  },
  {
    date: '2024-02-15',
    description: 'Sold ETH for profit',
    amount: 300,
    currency: 'USD'
  },
    {
    date: '2024-02-20',
    description: 'USDC Salary Deposit',
    amount: 2500,
    currency: 'USDC',
  }
];
