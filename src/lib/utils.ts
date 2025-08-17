import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Detects the cryptocurrency type from a wallet address
 * @param address - The wallet address to analyze
 * @returns The detected cryptocurrency type or null if unknown
 */
export function detectCryptoType(address: string): string | null {
  if (!address || typeof address !== 'string') {
    return null;
  }

  const cleanAddress = address.trim().toLowerCase();

  // Bitcoin addresses (P2PKH, P2SH, Bech32)
  if (
    (cleanAddress.startsWith('1') && cleanAddress.length >= 26 && cleanAddress.length <= 35) || // P2PKH (26-35 chars)
    (cleanAddress.startsWith('3') && cleanAddress.length >= 26 && cleanAddress.length <= 35) || // P2SH (26-35 chars)
    cleanAddress.startsWith('bc1') || // Bech32
    cleanAddress.startsWith('tb1') // Testnet Bech32
  ) {
    return 'BTC';
  }

  // Ethereum addresses (0x followed by 40 hex characters)
  if (
    cleanAddress.startsWith('0x') && 
    cleanAddress.length === 42 && 
    /^0x[a-f0-9]{40}$/.test(cleanAddress)
  ) {
    return 'ETH';
  }

  // Solana addresses (base58 encoded, typically 32-44 characters)
  if (
    cleanAddress.length >= 32 && 
    cleanAddress.length <= 44 && 
    /^[1-9a-hj-np-z]+$/.test(cleanAddress) && // Base58 characters
    !cleanAddress.startsWith('0x') && // Not Ethereum
    !cleanAddress.startsWith('bc1') && // Not Bitcoin Bech32
    !cleanAddress.startsWith('tb1') && // Not Bitcoin testnet
    // For addresses starting with '1' or '3', they must be longer than typical Bitcoin addresses
    (cleanAddress.startsWith('1') && cleanAddress.length > 34) || // Solana addresses starting with '1' are longer
    (cleanAddress.startsWith('3') && cleanAddress.length > 34) || // Solana addresses starting with '3' are longer
    (!cleanAddress.startsWith('1') && !cleanAddress.startsWith('3')) // Other Solana addresses
  ) {
    return 'SOL';
  }

  return null;
}
