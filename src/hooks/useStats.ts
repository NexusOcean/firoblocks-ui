import { useQuery } from '@tanstack/react-query';
import { getBlocks, getNetworkStats, getRecentTransactions } from '@/services/api';
import { formatFiro } from '@/utils';

export const useNetworkStats = () =>
	useQuery({
		queryKey: ['network', 'stats'],
		queryFn: getNetworkStats,
		select: (data) => {
			const avgBlockSeconds = (data.difficulty * 2 ** 32) / data.hashrate;
			const avgBlockMinutes = avgBlockSeconds / 60;

			return {
				blockHeight: data.height.toLocaleString(),
				hashrate: `${(data.hashrate / 1_000_000_000).toFixed(2)} GH/s`,
				difficulty: data.difficulty.toFixed(0),
				avgBlockTime: `~${avgBlockMinutes.toFixed(2)} min`,
				supply: `${Math.round(data.totalSupply).toLocaleString()}`,
				txCount: data.transactions.toLocaleString()
			};
		},
		refetchInterval: 120_000
	});

export const useLatestBlocks = () =>
	useQuery({
		queryKey: ['blocks', 'latest'],
		queryFn: () => getBlocks(undefined, 10),
		select: (data) => data.blocks,
		refetchInterval: 120_000
	});

export const useLatestTransactions = () =>
	useQuery({
		queryKey: ['transactions', 'latest'],
		queryFn: () => getRecentTransactions(10),
		select: (data) =>
			data.map((tx) => {
				const amount = tx.vout.reduce((sum, o) => sum + o.value, 0);

				return {
					txid: tx.txid,
					time: tx.time,
					type: tx.type,
					valueOut: formatFiro(amount)
				};
			}),
		refetchInterval: 120_000
	});
