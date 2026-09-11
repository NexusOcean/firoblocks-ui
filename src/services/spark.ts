import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const sparkMonitorApi = axios.create({
	baseURL: 'https://firo-spark-sync-monitor.vercel.app/api',
	timeout: 60_000
});

export type EndpointStatus = 'green' | 'yellow' | 'red';

export interface SparkAnonSet {
	ok: boolean;
	ms: number;
	coins: number;
	mb: number;
	setHash: string;
	group: number;
	error: string | null;
	consistent: boolean;
}

export interface SparkEndpoint {
	id: string;
	name: string;
	operator: string;
	host: string;
	port: number;
	ok: boolean;
	height: number;
	latency_ms: number;
	version: string;
	spark_latest_coin_id: number | null;
	error: string | null;
	lag: number;
	spark_consistent: boolean | null;
	anonset: SparkAnonSet | null;
	status: EndpointStatus;
}

export interface SparkSummary {
	total: number;
	green: number;
	yellow: number;
	red: number;
}

export interface SparkStats {
	avg_latency: number;
	median_latency: number;
	fastest: number;
	slowest: number;
	max_lag: number;
	reachable: number;
	spark_group: number;
	anonset_mb: number;
	anonset_coins: number;
	anonset_ms: number;
	anonset_slow: number;
}

export interface SparkStatus {
	checked_at: string;
	reference: number;
	spark_consensus: number;
	spark_sethash_consensus: string;
	anonset_checked_at: string;
	endpoints: SparkEndpoint[];
	summary: SparkSummary;
	stats: SparkStats;
	polling: boolean;
	anonset_source: 'snapshot' | 'live';
	meta: Record<string, unknown>;
}

const getSparkStatus = () => sparkMonitorApi.get<SparkStatus>('/status').then((res) => res.data);

export const useSparkStatus = () =>
	useQuery({
		queryKey: ['spark-status'],
		queryFn: getSparkStatus,
		refetchInterval: 120_000,
		retry: 1
	});
