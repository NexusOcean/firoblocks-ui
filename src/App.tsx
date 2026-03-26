import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { Spin } from 'antd';
import routes from './routes';

const App = () => {
	const element = useRoutes(routes);
	return <Suspense fallback={<Spin size="large" fullscreen />}>{element}</Suspense>;
};

export default App;
