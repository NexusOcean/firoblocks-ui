import type { TransactionType } from '@/types/dto';

export const formatFiro = (amount: number) =>
	amount < 0.01 ? '<0.01' : Number(amount.toFixed(2)).toLocaleString();

export const TX_TYPE_COLORS: Record<TransactionType, string> = {
	transparent: 'default',
	spark: 'error',
	coinbase: 'warning',
	masternode: 'processing',
	unknown: 'default'
};
