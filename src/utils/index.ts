export const formatFiro = (amount: number): string => {
	if (amount === 0) return '0.00';
	if (amount < 0.01) return '<0.01';
	return amount.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
};
