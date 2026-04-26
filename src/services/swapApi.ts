import axios from 'axios';

const { VITE_LOCAL_SWAP, VITE_SWAP_URL } = import.meta.env;

const LOCAL_SWAP = VITE_LOCAL_SWAP === 'true';

const BASE = !LOCAL_SWAP ? VITE_SWAP_URL : 'http://localhost:3000';

const swapApi = axios.create({ baseURL: BASE, timeout: 15_000 });

let failureCount = 0;
const FAILURE_THRESHOLD = 3;

swapApi.interceptors.response.use(
	(response) => {
		failureCount = 0;
		return response;
	},
	(error) => {
		const status = error?.response?.status;
		const isServerError = status >= 500 || !status;

		if (isServerError) {
			failureCount++;

			if (failureCount >= FAILURE_THRESHOLD) {
				window.location.replace('/maintenance');
			}
		}

		return Promise.reject(error);
	}
);

export default swapApi;
