import { useState } from 'react';
import { Row, Col, Segmented } from 'antd';
import { useNetworkStats } from '@/hooks/useStats';
import StatCard from '@/components/StatCard';
import Network from '@/components/Network';
import NetworkTables from '@/components/NetworkTables';
import RecentTables from '@/components/RecentTables';
import {
	AimOutlined,
	BlockOutlined,
	ClockCircleOutlined,
	DollarOutlined,
	SwapOutlined,
	ThunderboltOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export default function Home() {
	const { data: stats, isLoading: statsLoading } = useNetworkStats();
	const { t } = useTranslation();
	const [view, setView] = useState<'recent' | 'network'>('recent');

	return (
		<div>
			<title>{`${t('titles.firoblock')} — ${t('titles.explorer')}`}</title>
			<Row gutter={[16, 16]} justify="center" style={{ marginBottom: 36 }}>
				<Col xs={24} sm={12} lg={5} xl={4}>
					<StatCard
						label={t('labels.blockHeight')}
						value={stats?.blockHeight}
						loading={statsLoading}
						icon={<BlockOutlined />}
					/>
				</Col>
				<Col xs={24} sm={12} lg={5} xl={4}>
					<StatCard
						label={t('labels.hashrate')}
						value={stats?.hashrate}
						loading={statsLoading}
						icon={<ThunderboltOutlined />}
					/>
				</Col>
				<Col xs={24} sm={12} lg={5} xl={4}>
					<StatCard
						label={t('labels.difficulty')}
						value={stats?.difficulty}
						loading={statsLoading}
						icon={<AimOutlined />}
					/>
				</Col>
				<Col xs={24} sm={12} lg={5} xl={4}>
					<StatCard
						label={t('labels.blockTime')}
						value={stats?.avgBlockTime}
						loading={statsLoading}
						icon={<ClockCircleOutlined />}
					/>
				</Col>
				<Col xs={24} sm={12} lg={5} xl={4}>
					<StatCard
						label={t('labels.firoSupply')}
						value={stats?.supply}
						loading={statsLoading}
						icon={<DollarOutlined />}
					/>
				</Col>
				<Col xs={24} sm={12} lg={5} xl={4}>
					<StatCard
						label={t('labels.transactions')}
						value={stats?.txCount}
						loading={statsLoading}
						icon={<SwapOutlined />}
					/>
				</Col>
			</Row>
			<Network />
			<Row justify="center" style={{ marginBottom: 12, paddingTop: 12 }}>
				<Segmented
					value={view}
					onChange={(v) => setView(v as 'recent' | 'network')}
					style={{ color: '#ba2a45' }}
					options={[
						{ label: t('labels.recentTransactions'), value: 'recent' },
						{ label: t('labels.nodeDetails'), value: 'network' }
					]}
				/>
			</Row>
			{view === 'recent' ? <RecentTables /> : <NetworkTables />}{' '}
		</div>
	);
}
