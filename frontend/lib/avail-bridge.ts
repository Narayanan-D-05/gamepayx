/**
 * Avail Nexus Bridge Integration
 * Using @avail-project/nexus-core for real bridging
 * Documentation: https://docs.availproject.org/nexus
 */

import type { BridgeParams, BridgeResult, SimulationResult } from '@avail-project/nexus-core';
import { getSupportedChains as getConfigChains } from './nexus-config';

/**
 * Bridge tokens using Avail Nexus SDK
 * This uses the real bridge() function from nexus-core
 */
export async function bridgeTokens(
  sdk: any,
  params: {
    token: 'ETH' | 'USDC';
    amount: string | number;
    toChainId: number;
    sourceChains?: number[];
  }
): Promise<BridgeResult> {
  
  if (!sdk) {
    throw new Error('Nexus SDK not initialized. Please connect your wallet.');
  }

  console.log('🌉 Starting Avail Nexus Bridge...');
  console.log('📋 Parameters:', params);

  try {
    // Use the REAL bridge() function from Nexus SDK
    const bridgeParams: BridgeParams = {
      token: params.token as any,
      amount: params.amount,
      chainId: params.toChainId as any,
      sourceChains: params.sourceChains,
    };

    console.log('📤 Calling sdk.bridge()...');
    const result: BridgeResult = await sdk.bridge(bridgeParams);
    
    console.log('✅ Bridge result:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Bridge failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Bridge failed',
    };
  }
}

/**
 * Simulate bridge to preview costs
 */
export async function simulateBridge(
  sdk: any,
  params: {
    token: 'ETH' | 'USDC';
    amount: string | number;
    toChainId: number;
    sourceChains?: number[];
  }
): Promise<SimulationResult> {
  
  if (!sdk) {
    throw new Error('Nexus SDK not initialized');
  }

  console.log('🧪 Simulating bridge...');

  try {
    const bridgeParams: BridgeParams = {
      token: params.token as any,
      amount: params.amount,
      chainId: params.toChainId as any,
      sourceChains: params.sourceChains,
    };

    // Use the REAL simulateBridge() function
    const simulation: SimulationResult = await sdk.simulateBridge(bridgeParams);
    
    console.log('✅ Simulation complete:', simulation);
    return simulation;
    
  } catch (error) {
    console.error('❌ Simulation failed:', error);
    throw error;
  }
}

/**
 * Get supported tokens
 */
export function getSupportedTokens() {
  return ['ETH', 'USDC'] as const;
}

/**
 * Get supported chains (automatically uses mainnet or testnet from config)
 */
export function getSupportedChains() {
  return getConfigChains();
}
