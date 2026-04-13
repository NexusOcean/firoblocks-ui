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

export const search = async (q: string): Promise<SearchResult> =>
	(await axiosInstance.get(`/search`, { params: { q } })).data;

export const getBlocks = async (before?: number, limit?: number): Promise<BlockListDto> =>
	(await axiosInstance.get(`/blocks`, { params: { before, limit } })).data;

export const getBlock = async (hashOrHeight: string | number): Promise<BlockDto> =>
	(await axiosInstance.get(`/blocks/${hashOrHeight}`)).data;

export const getRecentTransactions = async (limit?: number): Promise<TransactionDto[]> =>
	(await axiosInstance.get(`/transactions/recent`, { params: { limit } })).data;

export const getTransaction = async (txid: string): Promise<TransactionDto> =>
	(await axiosInstance.get(`/transactions/${txid}`)).data;

export const getAddress = async (
	address: string,
	page?: number,
	limit?: number
): Promise<AddressDto> =>
	(await axiosInstance.get(`/addresses/${address}`, { params: { page, limit } })).data;

export const getMempool = async (): Promise<MempoolDto> =>
	(await axiosInstance.get(`/mempool`)).data;

export const getNetworkStats = async (): Promise<NetworkStatsDto> =>
	(await axiosInstance.get(`/network/stats`)).data;
