import { getMempool } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

export function useMempoolDetail() {
	return useQuery({
		queryKey: ['mempool'],
		queryFn: () => getMempool(),
		refetchInterval: 30_000
	});
}
