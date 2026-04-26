import type { TransactionCategory, TransactionType, VinKind, VoutKind } from './dto';

export interface NetworkStats {
	blockHeight: number;
	difficulty: number;
	hashrate: string;
	supply: number;
	txCount: number;
}

export const TX_TYPE_COLORS: Record<TransactionType, string> = {
	transparent: 'default',
	spark: 'error',
	coinbase: 'warning',
	masternode: 'processing',
	unknown: 'default'
};

export const TX_CATEGORY_COLORS: Record<TransactionCategory, string> = {
	coinbase: 'warning',
	transparent: 'default',
	lelantus_mint: 'purple',
	lelantus_joinsplit: 'purple',
	lelantus_to_spark: 'magenta',
	spark_mint: 'error',
	spark_spend: 'error',
	sigma_mint: 'gold',
	sigma_spend: 'gold',
	zerocoin_mint: 'orange',
	zerocoin_spend: 'orange',
	masternode_register: 'blue',
	masternode_update_service: 'blue',
	masternode_update_registrar: 'blue',
	masternode_revoke: 'blue',
	coinbase_payload: 'warning',
	quorum_commitment: 'cyan',
	unknown: 'default'
};

export const VIN_KIND_COLORS: Record<VinKind, string> = {
	coinbase: 'warning',
	transparent: 'default',
	spark_spend: 'error',
	lelantus_joinsplit: 'purple',
	sigma_spend: 'gold',
	zerocoin_spend: 'orange',
	unknown: 'default'
};

export const VOUT_KIND_COLORS: Record<VoutKind, string> = {
	transparent: 'default',
	spark_mint: 'error',
	spark_smint: 'error',
	lelantus_mint: 'purple',
	lelantus_jmint: 'purple',
	sigma_mint: 'gold',
	zerocoin_mint: 'orange',
	op_return: 'default',
	exchange_addr: 'cyan',
	unknown: 'default'
};

export const TX_CATEGORY_LABELS: Record<TransactionCategory, string> = {
	coinbase: 'Coinbase',
	transparent: 'Transparent',
	lelantus_mint: 'Lelantus Mint',
	lelantus_joinsplit: 'Lelantus Spend',
	lelantus_to_spark: 'Lelantus → Spark',
	spark_mint: 'Spark Shield',
	spark_spend: 'Spark Spend',
	sigma_mint: 'Sigma Mint',
	sigma_spend: 'Sigma Spend',
	zerocoin_mint: 'Zerocoin Mint',
	zerocoin_spend: 'Zerocoin Spend',
	masternode_register: 'MN Register',
	masternode_update_service: 'MN Update Service',
	masternode_update_registrar: 'MN Update Registrar',
	masternode_revoke: 'MN Revoke',
	coinbase_payload: 'Coinbase Payload',
	quorum_commitment: 'Quorum Commitment',
	unknown: 'Unknown'
};

export const VIN_KIND_LABELS: Record<VinKind, string> = {
	coinbase: 'Coinbase',
	transparent: 'Transparent',
	spark_spend: 'Spark Spend',
	lelantus_joinsplit: 'Lelantus Spend',
	sigma_spend: 'Sigma Spend',
	zerocoin_spend: 'Zerocoin Spend',
	unknown: 'Unknown'
};

export const VOUT_KIND_LABELS: Record<VoutKind, string> = {
	transparent: 'Transparent',
	spark_mint: 'Spark Mint',
	spark_smint: 'Spark Change',
	lelantus_mint: 'Lelantus Mint',
	lelantus_jmint: 'Lelantus Change',
	sigma_mint: 'Sigma Mint',
	zerocoin_mint: 'Zerocoin Mint',
	op_return: 'OP RETURN',
	exchange_addr: 'Exchange Address',
	unknown: 'Unknown'
};

export type ExchangeStatus =
	| 'waiting'
	| 'confirming'
	| 'exchanging'
	| 'sending'
	| 'finished'
	| 'failed'
	| 'refunded'
	| 'verifying';

export type AllowedCoin = 'btc' | 'eth' | 'ltc' | 'xmr' | 'firo';

export const COIN_VALIDATION: Record<AllowedCoin, string> = {
	firo: '^[a4][1-9A-HJ-NP-Za-km-z]{25,40}$',
	ltc: '^(L|M|3)[A-Za-z0-9]{33}$|^(ltc1)[0-9A-Za-z]{39}$',
	eth: '^(0x)[0-9A-Fa-f]{40}$',
	btc: '^[13][a-km-zA-HJ-NP-Z1-9]{25,80}$|^(bc1)[0-9A-Za-z]{25,80}$',
	xmr: '^[48][a-zA-Z\\d]{94}([a-zA-Z\\d]{11})?$'
};

export interface EstimateRequest {
	currency_from: AllowedCoin;
	currency_to: AllowedCoin;
	amount_from: string;
}

export interface EstimateResponse {
	estimated_amount: string;
}

export interface CreateExchangeRequest {
	currency_from: AllowedCoin;
	currency_to: AllowedCoin;
	address_to: string;
	amount_from: string;
	refund_address?: string;
	extra_id_to?: string;
	refund_extra_id?: string;
}

export interface Exchange {
	id: string;
	status: ExchangeStatus;
	currency_from: AllowedCoin;
	currency_to: AllowedCoin;
	amount_from: string;
	amount_to: string;
	address_from: string;
	address_to: string;
	extra_id_from: string;
	extra_id_to: string;
	tx_from: string;
	tx_to: string;
	refund_address: string;
	refund_extra_id: string;
}
