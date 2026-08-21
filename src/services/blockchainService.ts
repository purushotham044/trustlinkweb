// ============================================================
// TrustLink Web — Blockchain Service (Ethereum Sepolia)
// Anchoring via Supabase Edge Function & live on-chain queries via ethers
// ============================================================

import { supabase } from '@/lib/supabase';
import { BlockchainProof, VerificationResult } from '@/types';
import { BLOCKCHAIN_EXPLORER_BASE, CONTRACT_EXPLORER_BASE, CONTRACT_ADDRESS, SEPOLIA_RPC_URL } from '@/lib/constants';
import { ethers } from 'ethers';

const CONTRACT_ABI = [
  'function anchorDocument(bytes32 documentHash) external',
  'function verifyDocument(bytes32 documentHash) external view returns (bool exists, address owner, uint256 timestamp, uint256 blockNumber)',
  'event DocumentAnchored(bytes32 indexed documentHash, address indexed owner, uint256 timestamp, uint256 blockNumber)'
];

export const blockchainService = {
  /**
   * Fetches an existing confirmed or pending blockchain proof for a document.
   */
  async getBlockchainProof(documentId: string): Promise<BlockchainProof | null> {
    const { data, error } = await supabase
      .from('blockchain_proofs')
      .select('*')
      .eq('document_id', documentId)
      .maybeSingle();

    if (error) {
      console.warn('Error fetching blockchain proof:', error);
      return null;
    }

    return data as BlockchainProof | null;
  },

  /**
   * Anchors a document to Ethereum Sepolia via Edge Function.
   */
  async anchorDocument(documentId: string): Promise<BlockchainProof> {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) throw new Error('Not authenticated');

    const { data: edgeData, error: edgeError } = await supabase.functions.invoke('anchor-document', {
      body: { documentId },
    });

    if (edgeError || !edgeData?.success) {
      const errMsg = edgeData?.error || edgeError?.message || 'Failed to anchor document on Ethereum Sepolia.';
      throw new Error(`Blockchain Anchoring Error: ${errMsg}`);
    }

    const proof = edgeData.proof as BlockchainProof;

    // Log to audit trail
    try {
      await supabase.from('audit_logs').insert({
        user_id: session.session.user.id,
        document_id: documentId,
        action: 'BLOCKCHAIN_ANCHORED',
        metadata: {
          transaction_hash: proof.transaction_hash,
          block_number: proof.block_number,
          network: proof.blockchain_network,
        },
      });
    } catch (e) {}

    return proof;
  },

  /**
   * Queries the Ethereum Sepolia smart contract directly via JSON-RPC.
   */
  async verifyOnChain(sha256Hash: string): Promise<{ exists: boolean; owner: string; timestamp: number; blockNumber: number }> {
    try {
      const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const formattedHash = sha256Hash.startsWith('0x') ? sha256Hash : `0x${sha256Hash}`;
      const [exists, owner, timestamp, blockNumber] = await contract.verifyDocument(formattedHash);

      return {
        exists,
        owner,
        timestamp: Number(timestamp),
        blockNumber: Number(blockNumber),
      };
    } catch (err: any) {
      console.warn('Live on-chain verification query note:', err.message);
      return { exists: false, owner: '', timestamp: 0, blockNumber: 0 };
    }
  },

  /**
   * Dual-layer integrity check: local hash vs stored hash vs Sepolia blockchain record.
   */
  async verifyDualIntegrity(
    documentName: string,
    currentHash: string,
    storedHash: string | null,
    proof: BlockchainProof | null
  ): Promise<VerificationResult> {
    const normCurrent = currentHash.trim().toLowerCase();
    const normStored = (storedHash || '').trim().toLowerCase();
    const trustlinkMatch = normCurrent === normStored;

    let blockchainMatch: boolean | null = null;
    let blockchainHash: string | null = null;

    if (proof && proof.status === 'CONFIRMED' && proof.document_hash) {
      blockchainHash = proof.document_hash.trim().toLowerCase();
      blockchainMatch = normCurrent === blockchainHash;
    } else {
      // Direct live on-chain check
      const onChain = await this.verifyOnChain(normCurrent);
      if (onChain.exists) {
        blockchainMatch = true;
        blockchainHash = normCurrent;
      }
    }

    const overallVerified = trustlinkMatch && (blockchainMatch !== false);

    return {
      documentName,
      currentHash: normCurrent,
      storedHash: normStored || null,
      blockchainHash,
      trustlinkMatch,
      blockchainMatch,
      blockchainProof: proof,
      overallVerified,
      verifiedAt: new Date().toISOString(),
    };
  },

  getExplorerUrl(txHash: string | null): string {
    if (!txHash) return '';
    return `${BLOCKCHAIN_EXPLORER_BASE}${txHash}`;
  },

  getContractUrl(address: string = CONTRACT_ADDRESS): string {
    return `${CONTRACT_EXPLORER_BASE}${address}`;
  }
};
