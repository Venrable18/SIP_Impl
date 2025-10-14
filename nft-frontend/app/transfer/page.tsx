'use client';

import { useState } from 'react';
import { useNFTContract } from '../hooks/useNFTContract';

export default function TransferPage() {
  const [tokenId, setTokenId] = useState('');
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const { transferNFT, isLoading, error, txId, clearError, clearTxId } = useNFTContract();
  const [success, setSuccess] = useState(false);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    clearTxId();
    setSuccess(false);

    try {
      const id = parseInt(tokenId);
      if (isNaN(id) || id <= 0) {
        throw new Error('Invalid token ID');
      }

      await transferNFT(id, sender, recipient);
      setSuccess(true);
      setTokenId('');
      setSender('');
      setRecipient('');
    } catch (err) {
      console.error('Transfer error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Transfer NFT
            </h1>
            <p className="text-gray-600">
              Transfer ownership of a Sacasm NFT to another address
            </p>
          </div>

          <form onSubmit={handleTransfer} className="space-y-6">
            <div>
              <label 
                htmlFor="tokenId" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Token ID *
              </label>
              <input
                type="number"
                id="tokenId"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                placeholder="1"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
                disabled={isLoading}
              />
              <p className="mt-2 text-sm text-gray-500">
                The ID of the NFT you want to transfer (must be a positive number)
              </p>
            </div>

            <div>
              <label 
                htmlFor="sender" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Sender Address (Current Owner) *
              </label>
              <input
                type="text"
                id="sender"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
                disabled={isLoading}
              />
              <p className="mt-2 text-sm text-gray-500">
                The current owner's Stacks address (must be tx-sender)
              </p>
            </div>

            <div>
              <label 
                htmlFor="recipient" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Recipient Address (New Owner) *
              </label>
              <input
                type="text"
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
                disabled={isLoading}
              />
              <p className="mt-2 text-sm text-gray-500">
                The new owner's Stacks address (cannot be the same as sender)
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {success && txId && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Success!</h3>
                    <p className="mt-1 text-sm text-green-700">
                      NFT transfer transaction submitted
                    </p>
                    <p className="mt-2 text-xs text-green-600 break-all">
                      Transaction ID: {txId}
                    </p>
                    <a
                      href={`https://explorer.hiro.so/txid/${txId}?chain=testnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center text-sm text-green-700 hover:text-green-800 font-medium"
                    >
                      View on Explorer
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading || !tokenId || !sender || !recipient}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all transform hover:scale-105 ${
                  isLoading || !tokenId || !sender || !recipient
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Transferring...
                  </span>
                ) : (
                  'Transfer NFT'
                )}
              </button>

              <button
                type="button"
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Back to Home
              </button>
            </div>
          </form>

          <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="text-sm font-semibold text-yellow-900 mb-2">
              Important Notes:
            </h3>
            <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
              <li>The sender must be the current owner of the NFT</li>
              <li>The tx-sender must match the sender address</li>
              <li>Token ID must exist and be greater than 0</li>
              <li>Sender and recipient cannot be the same address</li>
              <li>Make sure you have STX for transaction fees</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
