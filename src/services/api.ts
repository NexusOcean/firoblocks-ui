import type {
	SearchResult,
	BlockListDto,
	BlockDto,
	TransactionDto,
	AddressDto,
	MempoolDto,
	NetworkStatsDto
} from '../types/dto';
import axiosInstance from './axiosInstance';

const { VITE_LOCAL_API, VITE_API_URL } = import.meta.env;

const LOCAL_API = VITE_LOCAL_API === 'false';

const BASE = LOCAL_API ? VITE_API_URL : 'http://localhost:3000/v1';

export const getHealth = async () => (await axiosInstance.get(`${BASE}/health`)).data;

export const search = async (q: string): Promise<SearchResult> =>
	(await axiosInstance.get(`${BASE}/search`, { params: { q } })).data;

export const getBlocks = async (before?: number, limit?: number): Promise<BlockListDto> =>
	(await axiosInstance.get(`${BASE}/blocks`, { params: { before, limit } })).data;

export const getBlock = async (hashOrHeight: string | number): Promise<BlockDto> =>
	(await axiosInstance.get(`${BASE}/blocks/${hashOrHeight}`)).data;

export const getRecentTransactions = async (limit?: number): Promise<TransactionDto[]> =>
	(await axiosInstance.get(`${BASE}/transactions/recent`, { params: { limit } })).data;

export const getTransaction = async (txid: string): Promise<TransactionDto> =>
	(await axiosInstance.get(`${BASE}/transactions/${txid}`)).data;

export const getAddress = async (
	address: string,
	page?: number,
	limit?: number
): Promise<AddressDto> =>
	(await axiosInstance.get(`${BASE}/addresses/${address}`, { params: { page, limit } })).data;

export const getMempool = async (): Promise<MempoolDto> =>
	(await axiosInstance.get(`${BASE}/mempool`)).data;

export const getNetworkStats = async (): Promise<NetworkStatsDto> =>
	(await axiosInstance.get(`${BASE}/network/stats`)).data;
