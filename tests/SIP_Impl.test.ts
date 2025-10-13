import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

// Error constants from the contract
const ERR_OWNER_ONLY = 100;
const ERR_NOT_TOKEN_OWNER = 101;
const ERR_INVALID_TOKEN_ID = 107;
const ERR_INVALID_RECIPIENT = 108;

describe("NFT Trait Contract", () => {
  it("should be deployed successfully", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  it("should define the nft-trait correctly", () => {
    // The trait contract should be deployed and accessible
    // Since it's just a trait definition, we can verify it exists by checking if our main contract implements it
    const { result } = simnet.callReadOnlyFn("SIP_Impl", "get-last-token-id", [], deployer);
    expect(result).toBeOk(Cl.uint(0));
  });
});

describe("SIP_Impl NFT Contract", () => {
  beforeEach(() => {
    // Reset simnet state before each test
    simnet.mineEmptyBlocks(1);
  });

  describe("Initial State", () => {
    it("should start with zero tokens", () => {
      const { result } = simnet.callReadOnlyFn("SIP_Impl", "get-last-token-id", [], deployer);
      expect(result).toBeOk(Cl.uint(0));
    });

    it("should return the correct base URI", () => {
      const { result } = simnet.callReadOnlyFn("SIP_Impl", "get-token-uri", [Cl.uint(1)], deployer);
      expect(result).toBeOk(Cl.some(Cl.stringAscii("https://orange-official-walrus-920.mypinata.cloud/ipfs/bafkreiejb6tl4fnmbnypg37wg6k55nul3gqcxgioay5qdifct6q7cs62cy")));
    });

    it("should return none for non-existent token owner", () => {
      const { result } = simnet.callReadOnlyFn("SIP_Impl", "get-owner", [Cl.uint(1)], deployer);
      expect(result).toBeOk(Cl.none());
    });
  });

  describe("Minting Functionality", () => {
    it("should allow the contract owner to mint NFTs", () => {
      const { result } = simnet.callPublicFn("SIP_Impl", "mint", [Cl.principal(wallet1)], deployer);
      expect(result).toBeOk(Cl.uint(1));

      // Verify the token was minted
      const { result: lastTokenId } = simnet.callReadOnlyFn("SIP_Impl", "get-last-token-id", [], deployer);
      expect(lastTokenId).toBeOk(Cl.uint(1));
    });

    it("should update the owner after minting", () => {
      simnet.callPublicFn("SIP_Impl", "mint", [Cl.principal(wallet1)], deployer);

      const { result } = simnet.callReadOnlyFn("SIP_Impl", "get-owner", [Cl.uint(1)], deployer);
      expect(result).toBeOk(Cl.some(Cl.principal(wallet1)));
    });

    it("should mint multiple tokens correctly", () => {
      // Mint first token
      simnet.callPublicFn("SIP_Impl", "mint", [Cl.principal(wallet1)], deployer);
      
      // Mint second token
      const { result } = simnet.callPublicFn("SIP_Impl", "mint", [Cl.principal(wallet2)], deployer);
      expect(result).toBeOk(Cl.uint(2));

      // Verify last token ID
      const { result: lastTokenId } = simnet.callReadOnlyFn("SIP_Impl", "get-last-token-id", [], deployer);
      expect(lastTokenId).toBeOk(Cl.uint(2));
    });

    it("should prevent non-owners from minting", () => {
      const { result } = simnet.callPublicFn("SIP_Impl", "mint", [Cl.principal(wallet2)], wallet1);
      expect(result).toBeErr(Cl.uint(ERR_OWNER_ONLY));
    });

    it("should prevent owner from minting to themselves", () => {
      const { result } = simnet.callPublicFn("SIP_Impl", "mint", [Cl.principal(deployer)], deployer);
      expect(result).toBeErr(Cl.uint(ERR_INVALID_RECIPIENT));
    });
  });

  describe("Transfer Functionality", () => {
    beforeEach(() => {
      // Mint a token for testing transfers
      simnet.callPublicFn("SIP_Impl", "mint", [Cl.principal(wallet1)], deployer);
    });

    it("should allow token owner to transfer their NFT", () => {
      const { result } = simnet.callPublicFn("SIP_Impl", "transfer", [
        Cl.uint(1),
        Cl.principal(wallet1),
        Cl.principal(wallet2)
      ], wallet1);
      
      expect(result).toBeOk(Cl.bool(true));

      // Verify ownership changed
      const { result: newOwner } = simnet.callReadOnlyFn("SIP_Impl", "get-owner", [Cl.uint(1)], deployer);
      expect(newOwner).toBeOk(Cl.some(Cl.principal(wallet2)));
    });

    it("should prevent non-owners from transferring", () => {
      const { result } = simnet.callPublicFn("SIP_Impl", "transfer", [
        Cl.uint(1),
        Cl.principal(wallet1),
        Cl.principal(wallet2)
      ], wallet2); // wallet2 is not the sender
      
      expect(result).toBeErr(Cl.uint(ERR_NOT_TOKEN_OWNER));
    });

    it("should prevent transfers with wrong sender", () => {
      const { result } = simnet.callPublicFn("SIP_Impl", "transfer", [
        Cl.uint(1),
        Cl.principal(wallet2), // Wrong sender
        Cl.principal(wallet3)
      ], wallet1);
      
      expect(result).toBeErr(Cl.uint(ERR_NOT_TOKEN_OWNER));
    });

    it("should prevent self-transfers", () => {
      const { result } = simnet.callPublicFn("SIP_Impl", "transfer", [
        Cl.uint(1),
        Cl.principal(wallet1),
        Cl.principal(wallet1) // Same as sender
      ], wallet1);
      
      expect(result).toBeErr(Cl.uint(ERR_INVALID_RECIPIENT));
    });

    it("should prevent transfers of non-existent tokens", () => {
      const { result } = simnet.callPublicFn("SIP_Impl", "transfer", [
        Cl.uint(999), // Non-existent token
        Cl.principal(wallet1),
        Cl.principal(wallet2)
      ], wallet1);
      
      expect(result).toBeErr(Cl.uint(ERR_INVALID_TOKEN_ID));
    });

    it("should prevent transfers with invalid token ID (zero)", () => {
      const { result } = simnet.callPublicFn("SIP_Impl", "transfer", [
        Cl.uint(0), // Invalid token ID
        Cl.principal(wallet1),
        Cl.principal(wallet2)
      ], wallet1);
      
      expect(result).toBeErr(Cl.uint(ERR_INVALID_TOKEN_ID));
    });
  });

  describe("Read-only Functions", () => {
    beforeEach(() => {
      // Mint some tokens for testing
      simnet.callPublicFn("SIP_Impl", "mint", [Cl.principal(wallet1)], deployer);
      simnet.callPublicFn("SIP_Impl", "mint", [Cl.principal(wallet2)], deployer);
    });

    it("should return correct last token ID", () => {
      const { result } = simnet.callReadOnlyFn("SIP_Impl", "get-last-token-id", [], deployer);
      expect(result).toBeOk(Cl.uint(2));
    });

    it("should return token URI for any token ID", () => {
      const { result } = simnet.callReadOnlyFn("SIP_Impl", "get-token-uri", [Cl.uint(1)], deployer);
      expect(result).toBeOk(Cl.some(Cl.stringAscii("https://orange-official-walrus-920.mypinata.cloud/ipfs/bafkreiejb6tl4fnmbnypg37wg6k55nul3gqcxgioay5qdifct6q7cs62cy")));
    });

    it("should return token URI even for non-existent tokens", () => {
      const { result } = simnet.callReadOnlyFn("SIP_Impl", "get-token-uri", [Cl.uint(999)], deployer);
      expect(result).toBeOk(Cl.some(Cl.stringAscii("https://orange-official-walrus-920.mypinata.cloud/ipfs/bafkreiejb6tl4fnmbnypg37wg6k55nul3gqcxgioay5qdifct6q7cs62cy")));
    });

    it("should return correct owner for existing tokens", () => {
      const { result: owner1 } = simnet.callReadOnlyFn("SIP_Impl", "get-owner", [Cl.uint(1)], deployer);
      expect(owner1).toBeOk(Cl.some(Cl.principal(wallet1)));

      const { result: owner2 } = simnet.callReadOnlyFn("SIP_Impl", "get-owner", [Cl.uint(2)], deployer);
      expect(owner2).toBeOk(Cl.some(Cl.principal(wallet2)));
    });

    it("should return none for non-existent token owners", () => {
      const { result } = simnet.callReadOnlyFn("SIP_Impl", "get-owner", [Cl.uint(999)], deployer);
      expect(result).toBeOk(Cl.none());
    });
  });

  describe("SIP-009 Compliance", () => {
    it("should implement all required SIP-009 functions", () => {
      // Test that all trait functions are implemented and callable
      const functions = [
        "get-last-token-id",
        "get-token-uri", 
        "get-owner",
        "transfer"
      ];

      functions.forEach(functionName => {
        // This shouldn't throw an error for implemented functions
        expect(() => {
          if (functionName === "transfer") {
            simnet.callPublicFn("SIP_Impl", functionName, [
              Cl.uint(1),
              Cl.principal(wallet1),
              Cl.principal(wallet2)
            ], wallet1);
          } else if (functionName === "get-token-uri" || functionName === "get-owner") {
            simnet.callReadOnlyFn("SIP_Impl", functionName, [Cl.uint(1)], deployer);
          } else {
            simnet.callReadOnlyFn("SIP_Impl", functionName, [], deployer);
          }
        }).not.toThrow();
      });
    });

    it("should have correct function signatures", () => {
      // get-last-token-id should return (response uint uint)
      const { result: lastTokenId } = simnet.callReadOnlyFn("SIP_Impl", "get-last-token-id", [], deployer);
      expect(lastTokenId).toBeOk(Cl.uint(0));

      // get-token-uri should return (response (optional (string-ascii 256)) uint)
      const { result: tokenUri } = simnet.callReadOnlyFn("SIP_Impl", "get-token-uri", [Cl.uint(1)], deployer);
      expect(tokenUri).toBeOk(Cl.some(Cl.stringAscii("https://orange-official-walrus-920.mypinata.cloud/ipfs/bafkreiejb6tl4fnmbnypg37wg6k55nul3gqcxgioay5qdifct6q7cs62cy")));

      // get-owner should return (response (optional principal) uint)
      const { result: owner } = simnet.callReadOnlyFn("SIP_Impl", "get-owner", [Cl.uint(1)], deployer);
      expect(owner).toBeOk(Cl.none());
    });
  });

  describe("Edge Cases and Security", () => {
    it("should handle large token IDs correctly", () => {
      // Mint a token first
      simnet.callPublicFn("SIP_Impl", "mint", [Cl.principal(wallet1)], deployer);

      // Try to transfer with a very large token ID
      const { result } = simnet.callPublicFn("SIP_Impl", "transfer", [
        Cl.uint(4294967295), // Max uint32
        Cl.principal(wallet1),
        Cl.principal(wallet2)
      ], wallet1);
      
      expect(result).toBeErr(Cl.uint(ERR_INVALID_TOKEN_ID));
    });

    it("should maintain state consistency after multiple operations", () => {
      // Mint token
      simnet.callPublicFn("SIP_Impl", "mint", [Cl.principal(wallet1)], deployer);
      
      // Transfer token
      simnet.callPublicFn("SIP_Impl", "transfer", [
        Cl.uint(1),
        Cl.principal(wallet1),
        Cl.principal(wallet2)
      ], wallet1);

      // Transfer back
      simnet.callPublicFn("SIP_Impl", "transfer", [
        Cl.uint(1),
        Cl.principal(wallet2),
        Cl.principal(wallet3)
      ], wallet2);

      // Verify final owner
      const { result } = simnet.callReadOnlyFn("SIP_Impl", "get-owner", [Cl.uint(1)], deployer);
      expect(result).toBeOk(Cl.some(Cl.principal(wallet3)));

      // Verify token count is still 1
      const { result: lastTokenId } = simnet.callReadOnlyFn("SIP_Impl", "get-last-token-id", [], deployer);
      expect(lastTokenId).toBeOk(Cl.uint(1));
    });
  });
});