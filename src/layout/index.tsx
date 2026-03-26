import { Layout, Typography, Grid } from 'antd';
import { Outlet, Link } from 'react-router-dom';
import Search from './components/Search';
import { GithubOutlined } from '@ant-design/icons';
import './styles.less';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

export default function AppLayout() {
	const screens = useBreakpoint();

	return (
		<Layout className="app-layout">
			<Header className="app-header">
				<Link to="/" className="app-logo">
					<img src="/images/logo.svg" alt="FiroBlocks" className="app-logo-img" />
					<Text strong className="app-logo-text">
						FiroBlocks
					</Text>
				</Link>
				<div className="app-header-right">{screens.lg && <Search />}</div>
			</Header>

			<Content className="app-content">
				<Outlet />
			</Content>

			<Footer className="app-footer">
				<Text type="secondary" className="app-footer-text">
					FiroBlocks — open source Firo block explorer
				</Text>
				<a
					href="https://github.com/nexusocean8/electrumx-firo"
					target="_blank"
					rel="noreferrer"
					className="app-footer-link"
				>
					GitHub <GithubOutlined className="git-hub" />
				</a>
			</Footer>
		</Layout>
	);
}
