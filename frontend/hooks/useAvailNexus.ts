'use client';

import { useEffect, useState } from 'react';
import { useWalletClient, useAccount, usePublicClient } from 'wagmi';

/**
 * Hook to initialize Avail Nexus SDK (nexus-core)
 * Following official documentation: https://docs.availproject.org/nexus
 * API Reference: NexusSDK class with initialize(provider) method
 */
export function useAvailNexus() {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { address, isConnected, chain } = useAccount();
  const [sdk, setSdk] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

        // Import the REAL Nexus SDK
        const { NexusSDK } = await import('@avail-project/nexus-core');

        console.log('📦 NexusSDK class loaded');

        // Create SDK instance with config
        // Use 'testnet' for Sepolia, Base Sepolia, Polygon Amoy, etc.
        const nexusInstance = new NexusSDK({
          network: 'testnet',
          debug: true, // Enable debug logs
        });

        console.log('🔧 NexusSDK instance created');

        // Initialize with Ethereum provider (window.ethereum)
        if (typeof window !== 'undefined' && window.ethereum) {
          console.log('🔗 Initializing with window.ethereum...');
          
          // Add timeout to prevent hanging
          const initTimeout = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('SDK initialization timeout (30s)')), 30000)
          );
          
          const initPromise = nexusInstance.initialize(window.ethereum);
          
          await Promise.race([initPromise, initTimeout]);
          
          setSdk(nexusInstance);
          console.log('✅ Avail Nexus SDK initialized successfully!');
          console.log('📦 SDK methods available:', Object.keys(nexusInstance).slice(0, 10).join(', '));
        } else {
          throw new Error('window.ethereum not available - please install MetaMask');
        }
      } catch (err) {
        console.error('❌ Failed to initialize Nexus SDK:', err);
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        console.error('Error details:', errorMsg);
        setError(errorMsg);
        setSdk(null);
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
  };
}
