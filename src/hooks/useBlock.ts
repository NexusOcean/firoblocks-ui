import { useQuery } from '@tanstack/react-query';
import { getBlock } from '@/services/api';

export const useBlockDetail = (hash: string) =>
	useQuery({
		queryKey: ['block', hash],
		queryFn: () => getBlock(hash),
		enabled: !!hash
	});
