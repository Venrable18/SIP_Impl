'use client';

import { useState, useCallback } from 'react';
import {
  fetchCallReadOnlyFunction,
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  principalCV,
  uintCV,
  cvToJSON,
  stringAsciiCV,
} from '@stacks/transactions';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';
import { openContractCall } from '@stacks/connect';

// Contract configuration - Update these with your deployed contract details
const CONTRACT_ADDRESS = 'STP472NMPYXCMRB4G75EM43PESZT33FZG7GBVK8E'; // Replace with your contract address
const CONTRACT_NAME = 'SIP_Impl-v2'; // Replace with your contract name
const NFT_TRAIT_CONTRACT = 'nft-trait-v2';

// Network configuration
const NETWORK = STACKS_TESTNET; // Change to STACKS_MAINNET for production

export interface NFTData {
  tokenId: number;
  owner: string | null;
  tokenUri: string | null;
}

export function useNFTContract() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txId, setTxId] = useState<string | null>(null);

  // Read-only function: Get last token ID
  const getLastTokenId = useCallback(async (): Promise<number> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-last-token-id',
        functionArgs: [],
        network: NETWORK,
        senderAddress: CONTRACT_ADDRESS,
      });

      const jsonResult = cvToJSON(result);
      console.log('Last token ID result:', jsonResult);

      if (jsonResult.value) {
        return parseInt(jsonResult.value.value);
      }

      return 0;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get last token ID';
      setError(errorMessage);
      console.error('Error getting last token ID:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Read-only function: Get token URI
  const getTokenUri = useCallback(async (tokenId: number): Promise<string | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-token-uri',
        functionArgs: [uintCV(tokenId)],
        network: NETWORK,
        senderAddress: CONTRACT_ADDRESS,
      });

      const jsonResult = cvToJSON(result);
      console.log('Token URI result:', jsonResult);

      if (jsonResult.value && jsonResult.value.value) {
        return jsonResult.value.value;
      }

      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get token URI';
      setError(errorMessage);
      console.error('Error getting token URI:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Read-only function: Get token owner
  const getTokenOwner = useCallback(async (tokenId: number): Promise<string | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-owner',
        functionArgs: [uintCV(tokenId)],
        network: NETWORK,
        senderAddress: CONTRACT_ADDRESS,
      });

      const jsonResult = cvToJSON(result);
      console.log('Token owner result:', jsonResult);

      if (jsonResult.value && jsonResult.value.value) {
        return jsonResult.value.value;
      }

      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get token owner';
      setError(errorMessage);
      console.error('Error getting token owner:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get complete NFT data
  const getNFTData = useCallback(async (tokenId: number): Promise<NFTData> => {
    try {
      setIsLoading(true);
      setError(null);

      const [owner, tokenUri] = await Promise.all([
        getTokenOwner(tokenId),
        getTokenUri(tokenId),
      ]);

      return {
        tokenId,
        owner,
        tokenUri,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get NFT data';
      setError(errorMessage);
      console.error('Error getting NFT data:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getTokenOwner, getTokenUri]);

  // Write function: Mint NFT
  const mintNFT = useCallback(async (recipient: string): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);
      setTxId(null);

      // Validate recipient address
      if (!recipient || recipient.trim() === '') {
        throw new Error('Recipient address is required');
      }

      const txOptions = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'mint',
        functionArgs: [principalCV(recipient)],
        network: NETWORK,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data: any) => {
          console.log('Transaction submitted:', data.txId);
          setTxId(data.txId);
          setIsLoading(false);
        },
        onCancel: () => {
          console.log('Transaction cancelled');
          setIsLoading(false);
          setError('Transaction was cancelled');
        },
      };

      await openContractCall(txOptions);
      
      return txId || '';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mint NFT';
      setError(errorMessage);
      console.error('Error minting NFT:', err);
      setIsLoading(false);
      throw err;
    }
  }, [txId]);

  // Write function: Transfer NFT
  const transferNFT = useCallback(
    async (tokenId: number, sender: string, recipient: string): Promise<string> => {
      try {
        setIsLoading(true);
        setError(null);
        setTxId(null);

        // Validate inputs
        if (tokenId <= 0) {
          throw new Error('Invalid token ID');
        }
        if (!sender || sender.trim() === '') {
          throw new Error('Sender address is required');
        }
        if (!recipient || recipient.trim() === '') {
          throw new Error('Recipient address is required');
        }
        if (sender === recipient) {
          throw new Error('Sender and recipient cannot be the same');
        }

        const txOptions = {
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: 'transfer',
          functionArgs: [
            uintCV(tokenId),
            principalCV(sender),
            principalCV(recipient),
          ],
          network: NETWORK,
          anchorMode: AnchorMode.Any,
          postConditionMode: PostConditionMode.Allow,
          onFinish: (data: any) => {
            console.log('Transfer transaction submitted:', data.txId);
            setTxId(data.txId);
            setIsLoading(false);
          },
          onCancel: () => {
            console.log('Transfer cancelled');
            setIsLoading(false);
            setError('Transfer was cancelled');
          },
        };

        await openContractCall(txOptions);

        return txId || '';
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to transfer NFT';
        setError(errorMessage);
        console.error('Error transferring NFT:', err);
        setIsLoading(false);
        throw err;
      }
    },
    [txId]
  );

  // Get all NFTs (by iterating through token IDs)
  const getAllNFTs = useCallback(async (): Promise<NFTData[]> => {
    try {
      setIsLoading(true);
      setError(null);

      const lastTokenId = await getLastTokenId();
      const nfts: NFTData[] = [];

      for (let i = 1; i <= lastTokenId; i++) {
        try {
          const nftData = await getNFTData(i);
          nfts.push(nftData);
        } catch (err) {
          console.error(`Error getting NFT ${i}:`, err);
        }
      }

      return nfts;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get all NFTs';
      setError(errorMessage);
      console.error('Error getting all NFTs:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getLastTokenId, getNFTData]);

  return {
    // State
    isLoading,
    error,
    txId,
    // Read-only functions
    getLastTokenId,
    getTokenUri,
    getTokenOwner,
    getNFTData,
    getAllNFTs,
    // Write functions
    mintNFT,
    transferNFT,
    // Utility
    clearError: () => setError(null),
    clearTxId: () => setTxId(null),
  };
}
