import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import AppLayout from './layout';

const Home = lazy(() => import('./pages/home'));
const Block = lazy(() => import('./pages/block'));
const Transaction = lazy(() => import('./pages/transaction'));
const Address = lazy(() => import('./pages/address'));
const Error404 = lazy(() => import('./pages/error'));
const Maintenance = lazy(() => import('./pages/maintenance'));

const routes: RouteObject[] = [
	{
		element: <AppLayout />,
		children: [
			{ index: true, element: <Home /> },
			{ path: 'block/:height', element: <Block /> },
			{ path: 'tx/:txid', element: <Transaction /> },
			{ path: 'address/:address', element: <Address /> },
			{ path: '404', element: <Error404 /> },
			{ path: '*', element: <Error404 /> }
		]
	},
	{ path: 'maintenance', element: <Maintenance /> }
];

export default routes;
