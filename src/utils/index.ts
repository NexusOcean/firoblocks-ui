import type { TransactionType } from '@/types/dto';

export const formatFiro = (amount: number) => {
	if (amount === 0) return '0.00';
	if (amount < 0.01) return '<0.01';
	return amount.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
};

export const TX_TYPE_COLORS: Record<TransactionType, string> = {
	transparent: 'default',
	spark: 'error',
	coinbase: 'warning',
	masternode: 'processing',
	unknown: 'default'
};
