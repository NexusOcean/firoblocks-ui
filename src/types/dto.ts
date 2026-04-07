// --------------------------------------------------------
// Blocks
// --------------------------------------------------------

export interface BlockSummaryDto {
	hash: string;
	height: number;
	time: number;
	nTx: number;
	size: number;
	difficulty: number;
	chainlock: boolean;
}

export interface BlockListDto {
	blocks: BlockSummaryDto[];
	tip: number;
	nextCursor: number | null;
}

export interface BlockDto {
	hash: string;
	height: number;
	confirmations: number;
	time: number;
	medianTime: number;
	size: number;
	weight: number;
	difficulty: number;
	chainlock: boolean;
	nTx: number;
	previousBlockHeight?: string;
	nextBlockHeight?: string;
	txids: string[];
}

// --------------------------------------------------------
// Transactions
// --------------------------------------------------------

export type TransactionType = 'coinbase' | 'transparent' | 'spark' | 'masternode' | 'unknown';

export interface TxVinDto {
	txid?: string;
	vout?: number;
	address?: string;
	value?: number;
	nFees?: number;
	lTags?: string[];
	coinbase?: string;
}

export interface TxVoutDto {
	n: number;
	value: number;
	type: string;
	addresses: string[];
}

export interface TransactionDto {
	txid: string;
	type: TransactionType;
	size: number;
	fee?: number;
	confirmations: number;
	time: number;
	blockHash: string;
	blockHeight: number;
	chainlock: boolean;
	instantlock: boolean;
	vin: TxVinDto[];
	vout: TxVoutDto[];
}

// --------------------------------------------------------
// Addresses
// --------------------------------------------------------

export interface AddressTxSummaryDto {
	txid: string;
	type: string;
	time: number;
	blockHeight: number;
	confirmations: number;
	valueDelta?: number;
}

export interface AddressDto {
	address: string;
	balance: number;
	received: number;
	totalTxCount: number;
	transactions: AddressTxSummaryDto[];
	page: number;
	totalPages: number;
}

// --------------------------------------------------------
// Search
// --------------------------------------------------------

export type SearchResultType = 'block' | 'transaction' | 'address';

export interface SearchResult {
	type: SearchResultType;
	data: BlockDto | TransactionDto | AddressDto;
}

// --------------------------------------------------------
// Mempool
// --------------------------------------------------------

export interface MempoolDto {
	pendingCount: number;
	bytes: number;
	usage: number;
	maxMempool: number;
	minFee: number;
	instantSendLocks: number;
	txids: string[];
}

// --------------------------------------------------------
// Network
// --------------------------------------------------------

export interface NetworkStatsDto {
	height: number;
	transactions: number;
	totalSupply: number;
	difficulty: number;
	hashrate: number;
	bestBlockHash: string;
	updatedAt: string; // ISO 8601 date-time
}
