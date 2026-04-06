import { useQuery } from '@tanstack/react-query';
import { getBlocks, getNetworkStats, getRecentTransactions } from '@/services/api';

export const useNetworkStats = () =>
	useQuery({
		queryKey: ['network', 'stats'],
		queryFn: getNetworkStats,
		select: (data) => ({
			blockHeight: data.height.toLocaleString(),
			hashrate: `${(data.hashrate / 1_000_000_000).toFixed(2)} GH/s`,
			difficulty: data.difficulty.toFixed(0),
			supply: `${Math.round(data.totalSupply).toLocaleString()} FIRO`,
			txCount: data.transactions.toLocaleString()
		}),
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
			data.map((tx) => ({
				txid: tx.txid,
				time: tx.time,
				type: tx.type,
				valueOut: tx.vout.reduce((sum, o) => sum + o.value, 0).toFixed(2)
			})),
		refetchInterval: 120_000
	});
