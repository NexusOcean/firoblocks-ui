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
	txTypes?: Record<string, TransactionCategory>;
}

// --------------------------------------------------------
// Transactions
// --------------------------------------------------------

export type TransactionType = 'coinbase' | 'transparent' | 'spark' | 'masternode' | 'unknown';

export type TransactionCategory =
	| 'coinbase'
	| 'transparent'
	| 'lelantus_mint'
	| 'lelantus_joinsplit'
	| 'lelantus_to_spark'
	| 'spark_mint'
	| 'spark_spend'
	| 'sigma_mint'
	| 'sigma_spend'
	| 'zerocoin_mint'
	| 'zerocoin_spend'
	| 'masternode_register'
	| 'masternode_update_service'
	| 'masternode_update_registrar'
	| 'masternode_revoke'
	| 'coinbase_payload'
	| 'quorum_commitment'
	| 'unknown';

export type TransactionFlag =
	| 'has_transparent_change'
	| 'has_op_return'
	| 'has_p2sh'
	| 'has_multisig'
	| 'has_exchange_addr';

export type VinKind =
	| 'coinbase'
	| 'transparent'
	| 'spark_spend'
	| 'lelantus_joinsplit'
	| 'sigma_spend'
	| 'zerocoin_spend'
	| 'unknown';

export type VoutKind =
	| 'transparent'
	| 'spark_mint'
	| 'spark_smint'
	| 'lelantus_mint'
	| 'lelantus_jmint'
	| 'sigma_mint'
	| 'zerocoin_mint'
	| 'op_return'
	| 'exchange_addr'
	| 'unknown';

export interface TxVinDto {
	kind: VinKind;
	txid?: string;
	vout?: number;
	address?: string;
	value?: number;
	nFees?: number;
	lTags?: string[];
	serials?: string[];
	coinbase?: string;
}

export interface TxVoutDto {
	n: number;
	value: number;
	kind: VoutKind;
	type: string;
	addresses: string[];
	isPrivate: boolean;
}

export interface TransactionDto {
	txid: string;
	type: TransactionType;
	category: TransactionCategory;
	flags: TransactionFlag[];
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

export interface MasternodeCountryDto {
	countryCode: string;
	country: string;
	count: number;
}

export interface MasternodeAsnDto {
	asn: number;
	org: string;
	count: number;
}

export interface MasternodeStats {
	total: number;
	resolved: number;
	countries: MasternodeCountryDto[];
	asns: MasternodeAsnDto[];
}
