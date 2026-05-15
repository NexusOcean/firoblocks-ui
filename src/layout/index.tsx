import { Layout, Typography, Grid, Menu, Button, Drawer } from 'antd';
import {
	BlockOutlined,
	SwapOutlined,
	ClusterOutlined,
	MenuOutlined,
	NodeIndexOutlined,
	QuestionCircleOutlined
} from '@ant-design/icons';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Search from './Search';
import DonateModal from './Donate';

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

export default function AppLayout() {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const { pathname } = useLocation();
	const { t } = useTranslation();
	const screens = useBreakpoint();
	const navigate = useNavigate();

	useEffect(() => window.scrollTo(0, 0), [pathname]);

	const NAV_ITEMS = [
		{
			key: '/',
			icon: <NodeIndexOutlined style={{ fontSize: 22 }} />,
			label: t('links.network')
		},
		{
			key: '/activity',
			icon: <BlockOutlined style={{ fontSize: 22 }} />,
			label: t('links.activity')
		},
		{
			key: '/masternodes',
			icon: <ClusterOutlined style={{ fontSize: 22 }} />,
			label: t('links.masternodes')
		},
		{ key: '/swap', icon: <SwapOutlined style={{ fontSize: 22 }} />, label: t('links.swap') },
		{
			key: '/faq',
			icon: <QuestionCircleOutlined style={{ fontSize: 22 }} />,
			label: t('links.faq')
		}
	];

	const selectedKey =
		NAV_ITEMS.find((item) => item.key !== '/' && pathname.startsWith(item.key))?.key ?? '/';

	const handleNav = (key: string) => {
		navigate(key);
		setDrawerOpen(false);
	};

	return (
		<Layout className="app-layout">
			<Header className="app-header">
				<NavLink to="/" className="app-logo">
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
				</NavLink>
				<div className="app-header-right">
					<Search />
					{!screens.md && (
						<Button
							type="text"
							icon={<MenuOutlined />}
							onClick={() => setDrawerOpen(true)}
							className="search-toggle"
						/>
					)}
				</div>
			</Header>

			<Drawer
				placement="left"
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				width={220}
				styles={{ header: { display: 'none' }, body: { padding: 0 } }}
			>
				<Menu
					mode="inline"
					selectedKeys={[selectedKey]}
					items={NAV_ITEMS}
					styles={{ item: { color: '#fff', background: '#9e2339', marginTop: 8 } }}
					onClick={({ key }) => handleNav(key)}
					style={{ marginTop: 80 }}
				/>
			</Drawer>

			<Layout>
				{screens.md && (
					<Sider breakpoint="md" className="app-sider">
						<Menu
							mode="inline"
							selectedKeys={[selectedKey]}
							items={NAV_ITEMS}
							styles={{
								item: { color: '#fff', background: '#9e2339', marginTop: 8 }
							}}
							onClick={({ key }) => handleNav(key)}
						/>
					</Sider>
				)}

				<Layout>
					<Content className="app-content">
						<Outlet />
					</Content>

					<Footer className="app-footer">
						<Text className="app-footer-text">
							© {new Date().getFullYear()} {t('messages.firoblocks')}
						</Text>
						<span className="footer-links">
							<DonateModal />
						</span>
					</Footer>
				</Layout>
			</Layout>
		</Layout>
	);
}
