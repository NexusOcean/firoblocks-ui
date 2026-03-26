import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, theme } from 'antd';
import App from './App.tsx';
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
	<BrowserRouter>
		<QueryClientProvider client={queryClient}>
			<ConfigProvider
				theme={{
					algorithm: theme.darkAlgorithm,
					token: {
						colorPrimary: '#ba2a45',
						colorBgBase: '#141414',
						colorBgContainer: '#1a1a1a',
						fontFamily: "'Source Sans Pro', system-ui, sans-serif",
						fontSize: 16
					}
				}}
			>
				<App />
			</ConfigProvider>
		</QueryClientProvider>
	</BrowserRouter>
);
