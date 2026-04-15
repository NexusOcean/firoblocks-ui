import { useQuery } from '@tanstack/react-query';
import { getAddress } from '@/services/api';

export function useAddressDetail(address: string, page?: number, limit?: number) {
	return useQuery({
		queryKey: ['address', address, page],
		queryFn: () => getAddress(address, page, limit),
		enabled: !!address && /^[aZ34][1-9A-HJ-NP-Za-km-z]{25,40}$/.test(address)
	});
}
