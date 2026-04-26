import type {
	SearchResult,
	BlockListDto,
	BlockDto,
	TransactionDto,
	AddressDto,
	MempoolDto,
	NetworkStatsDto,
	MasternodeStats
} from '../types/dto';
import explorerApi from './explorerApi';
import swapApi from './swapApi';

import type { EstimateRequest, EstimateResponse, CreateExchangeRequest, Exchange } from '../types';

export const search = async (q: string): Promise<SearchResult> =>
	(await explorerApi.get(`/search`, { params: { q } })).data;

export const getBlocks = async (before?: number, limit?: number): Promise<BlockListDto> =>
	(await explorerApi.get(`/blocks`, { params: { before, limit } })).data;

export const getBlock = async (hashOrHeight: string | number): Promise<BlockDto> =>
	(await explorerApi.get(`/blocks/${hashOrHeight}`)).data;

export const getRecentTransactions = async (limit?: number): Promise<TransactionDto[]> =>
	(await explorerApi.get(`/transactions/recent`, { params: { limit } })).data;

export const getTransaction = async (txid: string): Promise<TransactionDto> =>
	(await explorerApi.get(`/transactions/${txid}`)).data;

export const getAddress = async (
	address: string,
	page?: number,
	limit?: number
): Promise<AddressDto> =>
	(await explorerApi.get(`/addresses/${address}`, { params: { page, limit } })).data;

export const getMempool = async (): Promise<MempoolDto> => (await explorerApi.get(`/mempool`)).data;

export const getNetworkStats = async (): Promise<NetworkStatsDto> =>
	(await explorerApi.get(`/network/stats`)).data;

export const getMasternodeStats = async (): Promise<MasternodeStats> =>
	(await explorerApi.get(`/masternodes/stats`)).data;

export const getPrice = async (): Promise<{ usd: number }> =>
	(await swapApi.get('/swap/price')).data;

export const getEstimate = async (req: EstimateRequest): Promise<EstimateResponse> =>
	(await swapApi.post<EstimateResponse>('/swap/estimate', req)).data;

export const createExchange = async (
	req: CreateExchangeRequest
): Promise<{ opaqueId: string; exchange: Exchange }> =>
	(await swapApi.post<{ opaqueId: string; exchange: Exchange }>('/swap/exchange', req)).data;

export const getExchange = async (opaqueId: string): Promise<Exchange> =>
	(await swapApi.get<Exchange>(`/swap/exchange/${opaqueId}`)).data;
