import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import AppLayout from './layout';

const Home = lazy(() => import('./pages/home'));
const Activity = lazy(() => import('./pages/activity'));
const Masternodes = lazy(() => import('./pages/masternodes'));
const Block = lazy(() => import('./pages/block'));
const Transaction = lazy(() => import('./pages/transaction'));
const Address = lazy(() => import('./pages/address'));
const Missing = lazy(() => import('./pages/missing'));
const Maintenance = lazy(() => import('./pages/maintenance'));

const { VITE_MAINTENANCE_PLANNED } = import.meta.env;
const planned = VITE_MAINTENANCE_PLANNED === 'true';

const routes: RouteObject[] = [
	{
		element: <AppLayout />,
		children: [
			{ index: true, element: !planned ? <Home /> : <Maintenance planned /> },
			{ path: 'maintenance', element: <Maintenance planned={planned} /> },
			{ path: 'activity', element: <Activity /> },
			{ path: 'masternodes', element: <Masternodes /> },
			{ path: 'block/:height', element: <Block /> },
			{ path: 'tx/:txid', element: <Transaction /> },
			{ path: 'address/:address', element: <Address /> },
			{ path: 'missing', element: <Missing /> },
			{ path: '*', element: <Missing /> }
		]
	}
];

export default routes;
