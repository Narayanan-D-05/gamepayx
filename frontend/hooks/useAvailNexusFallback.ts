'use client';

import { useEffect, useState } from 'react';
import { useWalletClient, useAccount } from 'wagmi';
import { getNexusConfig } from '@/lib/nexus-config';

/**
 * Fallback hook for Avail Nexus SDK
 * Works even if full SDK initialization fails
 * Provides demo/UI mode for presentations
 */
export function useAvailNexusFallback() {
  const { data: walletClient } = useWalletClient();
  const { address, isConnected, chain } = useAccount();
  const [sdk, setSdk] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fallbackMode, setFallbackMode] = useState(false);

  useEffect(() => {
    async function initNexusSDK() {
      if (!walletClient || !isConnected || !address) {
        setSdk(null);
        return;
      }

      if (sdk || isInitializing) return;

      setIsInitializing(true);
      setError(null);

      try {
        console.log('🚀 Initializing Avail Nexus SDK (nexus-core)...');
        console.log('📍 Wallet:', address);
        console.log('⛓️  Chain:', chain?.id);
        console.log('👛 Wallet Client:', walletClient.account.address);

        // Get network configuration
        const config = getNexusConfig();
        console.log('⚙️  Config:', config);

        // Try to import SDK
        const { NexusSDK } = await import('@avail-project/nexus-core');
        console.log('📦 NexusSDK class loaded');

        // Create instance with config
        const nexusInstance = new NexusSDK({
          network: config.network,
          debug: config.debug,
        });
        console.log('🔧 NexusSDK instance created');
        console.log('📡 Network mode:', config.network);
        console.log('⏱️  Timeout:', config.timeout / 1000, 'seconds');

        // Try initialization with network-specific timeout
        if (typeof window !== 'undefined' && window.ethereum) {
          console.log('🔗 Initializing with window.ethereum...');
          
          // Use network-specific timeout
          const initTimeout = new Promise((_, reject) => 
            setTimeout(() => reject(new Error(`Initialization timeout after ${config.timeout / 1000}s`)), config.timeout)
          );
          
          try {
            console.log('🔄 Starting SDK initialization...');
            const initResult = await Promise.race([
              nexusInstance.initialize(window.ethereum), 
              initTimeout
            ]);
            
            setSdk(nexusInstance);
            console.log('✅ Avail Nexus SDK initialized successfully on testnet!');
            console.log('📦 SDK ready:', nexusInstance);
            setError(null);
            setFallbackMode(false);
          } catch (timeoutErr) {
            console.error('❌ SDK initialization failed:', timeoutErr);
            console.warn('⚠️ Testnet initialization timeout - this can happen if Avail DA testnet is slow');
            console.warn('💡 Tip: Mainnet is more stable. Consider mainnet for production demos.');
            
            // Create fallback SDK for UI purposes
            const fallbackSDK = createFallbackSDK(address);
            setSdk(fallbackSDK);
            setFallbackMode(true);
            setError('Testnet initialization timeout (Avail testnet may be unavailable)');
          }
        } else {
          throw new Error('window.ethereum not available');
        }
      } catch (err) {
        console.error('❌ Failed to initialize Nexus SDK:', err);
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        
        // Enable fallback mode anyway
        console.log('🔄 Enabling fallback mode for UI demonstration');
        const fallbackSDK = createFallbackSDK(address);
        setSdk(fallbackSDK);
        setFallbackMode(true);
        setError(`Fallback mode: ${errorMsg}`);
      } finally {
        setIsInitializing(false);
      }
    }

    initNexusSDK();
  }, [walletClient, isConnected, address, chain, sdk, isInitializing]);

  return {
    sdk,
    isReady: !!sdk && !isInitializing,
    isInitializing,
    error,
    address,
    chainId: chain?.id,
    fallbackMode,
  };
}

/**
 * Create a fallback SDK for UI demonstration
 * This allows the UI to work even if real SDK fails
 */
function createFallbackSDK(address: string | undefined) {
  console.log('🧪 Creating fallback SDK for address:', address);
  
  return {
    // Mock bridge function
    async bridge(params: any) {
      console.log('🧪 [FALLBACK MODE] Bridge simulation:', params);
      console.log('📋 Parameters:', {
        token: params.token,
        amount: params.amount,
        fromChain: params.sourceChains?.[0] || 'unknown',
        toChain: params.chainId,
      });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('✅ [FALLBACK MODE] Bridge simulation complete');
      console.warn('⚠️ Note: This is a simulation. Real bridging requires full SDK initialization.');
      
      return {
        success: true,
        explorerUrl: `https://sepolia.etherscan.io/address/${address}`,
        transactionHash: `0xfallback${Date.now().toString(16)}`,
        _fallback: true,
        _note: 'This is a simulated result for UI demonstration',
      };
    },
    
    // Mock simulate function
    async simulateBridge(params: any) {
      console.log('🧪 [FALLBACK MODE] Simulate bridge:', params);
      
      return {
        success: true,
        totalEstimatedCost: '0.0006 ETH',
        estimatedTime: '2-5 minutes',
        steps: [
          { step: 'approve', cost: '0.0001 ETH' },
          { step: 'bridge', cost: '0.0003 ETH' },
          { step: 'execute', cost: '0.0002 ETH' },
        ],
        metadata: {
          approvalRequired: false,
          bridgeReceiveAmount: params.amount,
        },
        _fallback: true,
      };
    },
    
    // Mock get balances
    async getUnifiedBalances() {
      console.log('🧪 [FALLBACK MODE] Get unified balances');
      return [];
    },
    
    _isFallback: true,
    _address: address,
  };
}
