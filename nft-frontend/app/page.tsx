'use client';

import { useState, useEffect } from 'react';
import { useNFTContract, NFTData } from './hooks/useNFTContract';
import Link from 'next/link';

export default function HomePage() {
  const {
    getLastTokenId,
    getTokenUri,
    getTokenOwner,
    getAllNFTs,
    isLoading,
    error,
  } = useNFTContract();

  const [lastTokenId, setLastTokenId] = useState<number | null>(null);
  const [searchTokenId, setSearchTokenId] = useState('');
  const [searchResult, setSearchResult] = useState<NFTData | null>(null);
  const [allNFTs, setAllNFTs] = useState<NFTData[]>([]);
  const [showAllNFTs, setShowAllNFTs] = useState(false);

  // Load last token ID on mount
  useEffect(() => {
    loadLastTokenId();
  }, []);

  const loadLastTokenId = async () => {
    try {
      const id = await getLastTokenId();
      setLastTokenId(id);
    } catch (err) {
      console.error('Error loading last token ID:', err);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchResult(null);

    try {
      const id = parseInt(searchTokenId);
      if (isNaN(id) || id <= 0) {
        throw new Error('Invalid token ID');
      }

      const [owner, uri] = await Promise.all([
        getTokenOwner(id),
        getTokenUri(id),
      ]);

      setSearchResult({
        tokenId: id,
        owner,
        tokenUri: uri,
      });
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleLoadAllNFTs = async () => {
    try {
      setShowAllNFTs(true);
      const nfts = await getAllNFTs();
      setAllNFTs(nfts);
    } catch (err) {
      console.error('Error loading all NFTs:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <h1 className="text-5xl font-bold mb-4">Sacasm NFT Dashboard</h1>
          <p className="text-xl opacity-90">
            Manage and explore your SIP-009 NFT collection
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Minted</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  {lastTokenId !== null ? lastTokenId : '-'}
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>

          <Link href="/mint" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Mint NFT</p>
                <p className="text-lg font-semibold text-gray-700 mt-2 group-hover:text-purple-600">
                  Create New →
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-4 group-hover:bg-green-200 transition">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/transfer" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Transfer NFT</p>
                <p className="text-lg font-semibold text-gray-700 mt-2 group-hover:text-blue-600">
                  Send Token →
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-4 group-hover:bg-blue-200 transition">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Search NFT by Token ID</h2>
          
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <input
              type="number"
              value={searchTokenId}
              onChange={(e) => setSearchTokenId(e.target.value)}
              placeholder="Enter Token ID (e.g., 1)"
              min="1"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={isLoading || !searchTokenId}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {searchResult && (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border-2 border-purple-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">NFT Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-purple-200">
                  <span className="font-medium text-gray-700">Token ID:</span>
                  <span className="text-gray-900 font-semibold">{searchResult.tokenId}</span>
                </div>
                <div className="flex justify-between items-start py-2 border-b border-purple-200">
                  <span className="font-medium text-gray-700">Owner:</span>
                  <span className="text-gray-900 text-sm font-mono bg-white px-3 py-1 rounded break-all max-w-md text-right">
                    {searchResult.owner || 'None'}
                  </span>
                </div>
                <div className="flex justify-between items-start py-2">
                  <span className="font-medium text-gray-700">Token URI:</span>
                  <a
                    href={searchResult.tokenUri || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm break-all max-w-md text-right underline"
                  >
                    {searchResult.tokenUri || 'None'}
                  </a>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* All NFTs Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All NFTs</h2>
            <button
              onClick={handleLoadAllNFTs}
              disabled={isLoading || lastTokenId === 0}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading ? 'Loading...' : 'Load All NFTs'}
            </button>
          </div>

          {showAllNFTs && allNFTs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allNFTs.map((nft) => (
                <div
                  key={nft.tokenId}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border-2 border-gray-200 hover:border-purple-400 transition"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-purple-600">#{nft.tokenId}</span>
                    <div className="bg-purple-100 rounded-full p-2">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Owner</p>
                      <p className="text-xs font-mono bg-white px-2 py-1 rounded break-all">
                        {nft.owner ? `${nft.owner.slice(0, 10)}...${nft.owner.slice(-8)}` : 'None'}
                      </p>
                    </div>
                    {nft.tokenUri && (
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">URI</p>
                        <a
                          href={nft.tokenUri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 underline break-all"
                        >
                          View Metadata
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : showAllNFTs && allNFTs.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="mt-4 text-gray-500 font-medium">No NFTs found</p>
              <p className="text-sm text-gray-400 mt-2">Mint your first NFT to get started!</p>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Click "Load All NFTs" to view the entire collection</p>
            </div>
          )}
        </div>

        {/* Contract Info */}
        <div className="mt-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Contract Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 font-medium">Contract Address:</p>
              <p className="text-gray-900 font-mono mt-1">STP472NMPYXCMRB4G75EM43PESZT33FZG7GBVK8E</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Contract Name:</p>
              <p className="text-gray-900 font-mono mt-1">SIP_Impl-v2</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">NFT Name:</p>
              <p className="text-gray-900 font-mono mt-1">Sacasm</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Standard:</p>
              <p className="text-gray-900 font-mono mt-1">SIP-009</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
