import { useQuery } from '@tanstack/react-query';
import { getBlock } from '@/services/api';

export const useBlockDetail = (height: string) =>
	useQuery({
		queryKey: ['block', height],
		queryFn: () => getBlock(height),
		enabled: !!height && /^\d+$/.test(height)
	});
