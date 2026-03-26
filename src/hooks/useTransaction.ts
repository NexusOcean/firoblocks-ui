import { useQuery } from '@tanstack/react-query';
import { getTransaction } from '@/services/api';

export function useTransactionDetail(txid: string) {
	return useQuery({
		queryKey: ['transaction', txid],
		queryFn: () => getTransaction(txid),
		enabled: !!txid
	});
}
