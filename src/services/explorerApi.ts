import axios from 'axios';

const { VITE_LOCAL_API, VITE_API_URL } = import.meta.env;

const LOCAL_API = VITE_LOCAL_API === 'true';

const BASE = !LOCAL_API ? VITE_API_URL : 'http://localhost:3000/v1';

const explorerApi = axios.create({ baseURL: BASE, timeout: 15_000 });

let failureCount = 0;
const FAILURE_THRESHOLD = 3;

explorerApi.interceptors.response.use(
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

export default explorerApi;
