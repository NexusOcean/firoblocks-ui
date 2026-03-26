import { useQuery } from '@tanstack/react-query';
import { getAddress } from '@/services/api';

export function useAddressDetail(address: string, page?: number) {
	return useQuery({
		queryKey: ['address', address, page],
		queryFn: () => getAddress(address, page),
		enabled: !!address
	});
}
