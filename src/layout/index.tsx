import { Layout, Typography } from 'antd';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Search from './components/Search';
import { GithubOutlined } from '@ant-design/icons';
import './styles.less';
import { useEffect } from 'react';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

export default function AppLayout() {
	const { pathname } = useLocation();
	useEffect(() => window.scrollTo(0, 0), [pathname]);

	return (
		<Layout className="app-layout">
			<Header className="app-header">
				<Link to="/" className="app-logo" title="Home">
					<img src="/images/logo.svg" alt="FiroBlocks" className="app-logo-img" />
					<Text strong className="app-logo-text">
						FiroBlocks
					</Text>
				</Link>
				<Link to="/" className="app-logo" title="Home"></Link>
				<div className="app-header-right">
					<Search />
				</div>
			</Header>

			<Content className="app-content">
				<Outlet />
			</Content>

			<Footer className="app-footer">
				<Text type="secondary" className="app-footer-text">
					FiroBlocks — {new Date().getFullYear()}
				</Text>
				<a
					href="https://github.com/nexusocean"
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
