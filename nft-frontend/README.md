# Sacasm NFT Frontend

A comprehensive Next.js frontend application for interacting with your Sacasm SIP-009 NFT smart contract on the Stacks blockchain.

## Features

### 🎨 Mint NFTs
- Mint new Sacasm NFTs to any recipient address
- Real-time transaction tracking
- Transaction explorer integration

### 🔄 Transfer NFTs
- Transfer NFT ownership between addresses
- Validation for sender, recipient, and token ID
- Post-condition support for secure transfers

### 📊 Dashboard
- View total minted NFTs
- Search NFTs by Token ID
- Display owner and token URI information
- Load and browse all NFTs in the collection
- Interactive NFT cards with metadata

## Contract Functions Implemented

### Read-Only Functions
- `get-last-token-id()` - Get the last minted token ID
- `get-token-uri(token-id)` - Get the metadata URI for a token
- `get-owner(token-id)` - Get the owner of a specific token

### Write Functions
- `mint(recipient)` - Mint a new NFT to recipient address
- `transfer(token-id, sender, recipient)` - Transfer NFT ownership

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- A Stacks wallet (Hiro Wallet or Xverse)
- STX tokens for transaction fees

### Installation

1. **Install dependencies**
   ```bash
   cd nft-frontend
   npm install
   ```

2. **Update Contract Configuration**
   
   Edit `/app/hooks/useNFTContract.ts` and update these constants:
   ```typescript
   const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS';
   const CONTRACT_NAME = 'YOUR_CONTRACT_NAME';
   const NETWORK = STACKS_TESTNET; // or STACKS_MAINNET
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
nft-frontend/
├── app/
│   ├── hooks/
│   │   └── useNFTContract.ts    # Contract interaction hook
│   ├── mint/
│   │   └── page.tsx             # Mint NFT page
│   ├── transfer/
│   │   └── page.tsx             # Transfer NFT page
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Dashboard/Home page
│   └── globals.css              # Global styles
├── public/                       # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Usage Guide

### Minting NFTs

1. Navigate to the **Mint** page
2. Enter the recipient's Stacks address
3. Click **"Mint NFT"**
4. Approve the transaction in your wallet
5. View the transaction on the Stacks Explorer

**Important Notes:**
- Only the contract owner can mint NFTs
- The recipient cannot be the contract owner
- Requires STX for transaction fees

### Transferring NFTs

1. Navigate to the **Transfer** page
2. Enter:
   - Token ID (the NFT you want to transfer)
   - Sender address (current owner, must be tx-sender)
   - Recipient address (new owner)
3. Click **"Transfer NFT"**
4. Approve the transaction in your wallet

**Important Notes:**
- You must be the current owner (tx-sender = sender)
- Token ID must exist
- Sender and recipient must be different addresses

### Viewing NFTs

1. **Dashboard** shows:
   - Total number of minted NFTs
   - Quick action buttons
   
2. **Search by Token ID:**
   - Enter a token ID
   - View owner and metadata URI
   
3. **Load All NFTs:**
   - Click "Load All NFTs"
   - Browse the entire collection
   - View individual NFT details

## Contract Information

- **Contract Address:** `STP472NMPYXCMRB4G75EM43PESZT33FZG7GBVK8E`
- **Contract Name:** `SIP_Impl-v2`
- **NFT Name:** Sacasm
- **Standard:** SIP-009
- **Network:** Stacks Testnet

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Stacks.js** - Blockchain interaction
  - @stacks/connect - Wallet connection
  - @stacks/transactions - Transaction building
  - @stacks/network - Network configuration

## Error Handling

The application includes comprehensive error handling:
- Input validation for all forms
- Transaction error messages
- Network error handling
- User-friendly error displays

## Security Features

- Post-condition mode support
- Input validation
- Address verification
- Token ID existence checks
- Sender authorization validation

## Development

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Environment Variables

For production, consider adding:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=your-address
NEXT_PUBLIC_CONTRACT_NAME=your-contract
NEXT_PUBLIC_NETWORK=mainnet
```

## Troubleshooting

### Wallet Connection Issues
- Ensure you have a Stacks wallet installed
- Check that you're on the correct network (testnet/mainnet)
- Verify you have STX for transaction fees

### Transaction Failures
- Verify you're the contract owner (for minting)
- Check that you own the NFT (for transfers)
- Ensure all addresses are valid Stacks addresses
- Confirm token ID exists

### API Errors
- Check contract address and name are correct
- Verify network configuration
- Ensure contract is deployed

## Support

For issues or questions:
- Check the [Stacks documentation](https://docs.stacks.co)
- Review [Stacks.js reference](https://docs.hiro.so/stacks.js)
- Open an issue on GitHub

## License

MIT License - see LICENSE file for details

---

Built with ❤️ for the Stacks blockchain community
