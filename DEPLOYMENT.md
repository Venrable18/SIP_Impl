# SIP_Impl NFT Contract Deployment

## 🚀 Testnet Deployment Details

**Deployment Date**: October 14, 2025  
**Network**: Stacks Testnet  
**Deployer Address**: `STP472NMPYXCMRB4G75EM43PESZT33FZG7GBVK8E`

---

## 📋 Contract Information

### NFT Trait Contract
- **Contract Name**: `nft-trait-v2`
- **Contract ID**: `STP472NMPYXCMRB4G75EM43PESZT33FZG7GBVK8E.nft-trait-v2`
- **File Path**: `contracts/nft-trait.clar`
- **Deployment Cost**: 5,650 STX units
- **Explorer Link**: [View on Stacks Explorer](https://explorer.hiro.so/address/STP472NMPYXCMRB4G75EM43PESZT33FZG7GBVK8E?chain=testnet)

### Main NFT Implementation Contract  
- **Contract Name**: `SIP_Impl-v2`
- **Contract ID**: `STP472NMPYXCMRB4G75EM43PESZT33FZG7GBVK8E.SIP_Impl-v2`
- **File Path**: `contracts/SIP_Impl.clar`
- **Deployment Cost**: 20,450 STX units
- **Explorer Link**: [View on Stacks Explorer](https://explorer.hiro.so/address/STP472NMPYXCMRB4G75EM43PESZT33FZG7GBVK8E?chain=testnet)

---

## 💰 Deployment Summary

| Item | Cost |
|------|------|
| NFT Trait Contract | 5,650 STX units |
| Main NFT Contract | 20,450 STX units |
| **Total Deployment Cost** | **26,100 STX units (0.026100 STX)** |
| **Deployment Duration** | **1 block** |

---

## 🔗 Quick Links

### Contract Pages
- **NFT Trait Contract**: https://explorer.hiro.so/txid/STP472NMPYXCMRB4G75EM43PESZT33FZG7GBVK8E.nft-trait-v2?chain=testnet
- **Main NFT Contract**: https://explorer.hiro.so/txid/STP472NMPYXCMRB4G75EM43PESZT33FZG7GBVK8E.SIP_Impl-v2?chain=testnet

### Deployer Account
- **Address**: https://explorer.hiro.so/address/STP472NMPYXCMRB4G75EM43PESZT33FZG7GBVK8E?chain=testnet

---

## 📊 Contract Features

### SIP-009 NFT Standard Compliance
- ✅ Full SIP-009 NFT trait implementation
- ✅ Standard NFT functions: `get-last-token-id`, `get-token-uri`, `get-owner`, `transfer`
- ✅ Minting functionality with owner permissions
- ✅ Transfer functionality with security validations
- ✅ Comprehensive error handling

### Security Features
- ✅ Owner-only minting permissions
- ✅ Transfer validation (sender authorization, token existence)
- ✅ Self-transfer prevention
- ✅ Invalid recipient checks
- ✅ Non-existent token handling

### NFT Collection Details
- **Collection Name**: Sacasm NFT
- **Base URI**: `https://orange-official-walrus-920.mypinata.cloud/ipfs/bafkreiejb6tl4fnmbnypg37wg6k55nul3gqcxgioay5qdifct6q7cs62cy`
- **Collection Limit**: 1,000 NFTs
- **Token ID System**: Sequential (starting from 1)

---

## 🛠 Development Information

### Testing Status
- ✅ **25/25 Tests Passing**
- ✅ Comprehensive test coverage including:
  - Contract deployment validation
  - Minting functionality
  - Transfer operations
  - Read-only functions
  - SIP-009 compliance
  - Edge cases and security scenarios

### Technical Stack
- **Language**: Clarity Smart Contract Language
- **Version**: Clarity v2
- **Epoch**: 2.1
- **Testing Framework**: Vitest + Clarinet SDK
- **Development Environment**: Clarinet

---

## 🔧 Contract Interaction

### Using Clarinet Console
```bash
# Connect to testnet
clarinet console --testnet

# Mint an NFT (owner only)
(contract-call? .SIP_Impl-v2 mint 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5)

# Check token owner
(contract-call? .SIP_Impl-v2 get-owner u1)

# Get last token ID
(contract-call? .SIP_Impl-v2 get-last-token-id)

# Get token URI
(contract-call? .SIP_Impl-v2 get-token-uri u1)
```

### Using Stacks.js
```javascript
import { StacksTestnet } from '@stacks/network';
import { callReadOnlyFunction, contractPrincipalCV } from '@stacks/transactions';

const network = new StacksTestnet();
const contractAddress = 'STP472NMPYXCMRB4G75EM43PESZT33FZG7GBVK8E';
const contractName = 'SIP_Impl-v2';

// Example: Get last token ID
const result = await callReadOnlyFunction({
  contractAddress,
  contractName,
  functionName: 'get-last-token-id',
  functionArgs: [],
  network,
});
```

---

## 📝 Notes

1. **Contract Names**: Updated to `v2` suffix to avoid naming conflicts during deployment
2. **Network**: Deployed on Stacks Testnet for testing and development
3. **Mainnet Deployment**: Ready for mainnet deployment when needed
4. **Source Code**: All source code and tests are available in the repository

---

## 📞 Support

For questions or issues related to these contracts:
- Repository: [SIP_Impl](https://github.com/Venrable18/SIP_Impl)
- Contract Address: `STP472NMPYXCMRB4G75EM43PESZT33FZG7GBVK8E`

---

*Last Updated: October 14, 2025*