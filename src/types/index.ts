export interface NetworkStats {
	blockHeight: number;
	difficulty: number;
	hashrate: string;
	supply: number;
	txCount: number;
}

export interface Block {
	hash: string;
	height: number;
	time: number;
	nTx: number;
	size: number;
}

export interface BlockDetail extends Block {
	merkleRoot: string;
	nonce: number;
	bits: string;
	confirmations: number;
	previousBlockHash: string;
	nextBlockHash?: string;
	transactions: Transaction[];
}

export interface Transaction {
	txid: string;
	time: number;
	valueOut: number;
	type: 'coinbase' | 'transparent' | 'spark' | 'lelantus' | 'unknown';
}

export interface TxInput {
	address?: string;
	value?: number;
	type: 'transparent' | 'mint' | 'spend';
}

export interface TxOutput {
	address?: string;
	value: number;
	type: 'transparent' | 'mint' | 'spend';
}

export interface TransactionDetail {
	txid: string;
	time: number;
	blockHeight: number;
	blockHash: string;
	confirmations: number;
	size: number;
	fee: number;
	valueOut: number;
	type: 'transparent' | 'spark' | 'lelantus';
	inputs: TxInput[];
	outputs: TxOutput[];
}

export interface AddressDetail {
	address: string;
	balance: number;
	totalSent: number;
	totalReceived: number;
	txCount: number;
	transactions: Transaction[];
}

export const TYPE_COLOR: Record<Transaction['type'], string> = {
	coinbase: 'bg-[#ba2a45]',
	transparent: 'bg-gray-500',
	spark: 'bg-[#ba2a45]',
	lelantus: 'bg-violet-600',
	unknown: 'bg-gray-700'
};

export const IO_TYPE_COLOR: Record<TxInput['type'], string> = {
	transparent: 'bg-gray-500',
	mint: 'bg-[#ba2a45]',
	spend: 'bg-violet-600'
};
