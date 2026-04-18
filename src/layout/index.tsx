import { Layout, Typography, Grid } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Search from './Search';
import DonateModal from './Donate';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

export default function AppLayout() {
	const { pathname } = useLocation();
	const { t } = useTranslation();
	const screens = useBreakpoint();

	useEffect(() => window.scrollTo(0, 0), [pathname]);

	return (
		<Layout className="app-layout">
			<Header className="app-header">
				<Link to="/" className="app-logo" title={t('titles.home')}>
					<img
						src="/images/logo.svg"
						alt={t('titles.firoblock')}
						className="app-logo-img"
					/>
					{screens.md && (
						<Text strong className="app-logo-text">
							{t('titles.firoblock')}
						</Text>
					)}
				</Link>

				<div className="app-header-right">
					<Search />
				</div>
			</Header>

			<Content className="app-content">
				<Outlet />
			</Content>

			<Footer className="app-footer">
				<Text className="app-footer-text">
					© {new Date().getFullYear()} {t('messages.firoblocks')}
				</Text>
				<span className="footer-links">
					{screens.md && (
						<a
							href="https://github.com/nexusocean"
							target="_blank"
							rel="noreferrer"
							className="app-footer-link"
						>
							{t('links.github')}
							<GithubOutlined className="git-hub" />
						</a>
					)}

					<DonateModal />
				</span>
			</Footer>
		</Layout>
	);
}
