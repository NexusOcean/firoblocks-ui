import { Row, Col, Typography } from 'antd';
import { useNetworkStats } from '@/hooks/useStats';
import StatCard from '@/components/StatCard';
import Network from '@/components/Network';
import {
	AimOutlined,
	BlockOutlined,
	ClockCircleOutlined,
	DollarOutlined,
	SwapOutlined,
	ThunderboltOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

export default function Home() {
	const { data: stats, isLoading: statsLoading } = useNetworkStats();
	const { t } = useTranslation();

	return (
		<div>
			<title>{t('titles.explorer')}</title>
			<>
				<Row gutter={[24, 24]}>
					<Col>
						<Title level={3} style={{ color: '#ba2a45' }}>
							{t('labels.network')}
						</Title>
					</Col>
				</Row>
				<Row gutter={[16, 16]} justify="center">
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
			</>
		</div>
	);
}
