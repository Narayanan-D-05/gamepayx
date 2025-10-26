/**
 * Avail Nexus SDK Configuration
 * Easily switch between mainnet and testnet
 */

// Set this to switch networks
export const NEXUS_NETWORK: 'mainnet' | 'testnet' = 'testnet';

// Timeout configuration (in milliseconds)
export const NEXUS_INIT_TIMEOUT = {
  mainnet: 30000, // 30 seconds for mainnet
  testnet: 60000, // 60 seconds for testnet (can be slower)
};

/**
 * Get the current network configuration
 */
export function getNexusConfig() {
  return {
    network: NEXUS_NETWORK,
    timeout: NEXUS_INIT_TIMEOUT[NEXUS_NETWORK],
    debug: true,
  };
}

/**
 * Supported chains by network
 */
export const SUPPORTED_CHAINS = {
  mainnet: [
    { id: 1, name: 'Ethereum Mainnet', symbol: 'ETH' },
    { id: 8453, name: 'Base', symbol: 'ETH' },
    { id: 137, name: 'Polygon', symbol: 'MATIC' },
    { id: 10, name: 'Optimism', symbol: 'ETH' },
    { id: 42161, name: 'Arbitrum', symbol: 'ETH' },
  ],
  testnet: [
    { id: 11155111, name: 'Sepolia', symbol: 'ETH' },
    { id: 84532, name: 'Base Sepolia', symbol: 'ETH' },
    { id: 80002, name: 'Polygon Amoy', symbol: 'MATIC' },
    { id: 421614, name: 'Arbitrum Sepolia', symbol: 'ETH' },
  ],
};

/**
 * Get chains for current network
 */
export function getSupportedChains() {
  return SUPPORTED_CHAINS[NEXUS_NETWORK];
}

/**
 * Check if current network is mainnet
 */
export function isMainnet() {
  return NEXUS_NETWORK === 'mainnet';
}

/**
 * Check if current network is testnet
 */
export function isTestnet() {
  return NEXUS_NETWORK === 'testnet';
}
