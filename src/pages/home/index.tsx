import { useMemo } from 'react';
import { Typography, Row, Col, Table, Tag } from 'antd';
import { useLatestBlocks, useLatestTransactions, useNetworkStats } from '@/hooks/useHomeData';
import StatCard from '@/components/StatCard';
import HashLink from '@/components/HashLink';
import TimeAgo from '@/components/TimeAgo';
import type { BlockSummaryDto, TransactionType } from '@/types/dto';
import {
	AimOutlined,
	BlockOutlined,
	DollarOutlined,
	SwapOutlined,
	ThunderboltOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { truncateHash } from '@/components/HashDisplay';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const TX_TYPE_COLORS: Record<TransactionType | 'coinbase' | 'unknown', string> = {
	transparent: 'default',
	spark: 'error',
	coinbase: 'warning',
	unknown: 'default'
};

export default function Home() {
	const { t } = useTranslation();
	const { data: stats, isLoading: statsLoading } = useNetworkStats();
	const { data: blocks, isLoading: blocksLoading } = useLatestBlocks();
	const { data: txs, isLoading: txsLoading } = useLatestTransactions();
	const navigate = useNavigate();

	const blockColumns = useMemo(
		() => [
			{
				title: t('table.height'),
				dataIndex: 'height',
				key: 'height',
				render: (h: number) => (
					<HashLink value={h.toLocaleString()} to={`/block/${h}`} mono />
				)
			},
			{
				title: t('table.hash'),
				dataIndex: 'hash',
				key: 'hash',
				render: (h: string) => <span style={{ color: '#ba2a45' }}>{truncateHash(h)}</span>
			},
			{ title: t('table.txs'), dataIndex: 'nTx', key: 'nTx' },
			{
				title: t('table.size'),
				dataIndex: 'size',
				key: 'size',
				render: (s: number) => `${(s / 1024).toFixed(1)} KB`
			},
			{
				title: t('table.age'),
				dataIndex: 'time',
				key: 'time',
				render: (time: number) => <TimeAgo timestamp={time} />
			}
		],
		[t]
	);

	const txColumns = useMemo(
		() => [
			{
				title: t('table.txid'),
				dataIndex: 'txid',
				key: 'txid',
				render: (id: string) => <HashLink value={id} to={`/tx/${id}`} truncate />
			},
			{
				title: t('table.type'),
				dataIndex: 'type',
				key: 'type',
				render: (type: TransactionType) => <Tag color={TX_TYPE_COLORS[type]}>{type}</Tag>
			},
			{
				title: t('table.value'),
				dataIndex: 'valueOut',
				key: 'valueOut',
				render: (v: string) => `${v} FIRO`
			},
			{
				title: t('table.age'),
				dataIndex: 'time',
				key: 'time',
				render: (time: number) => <TimeAgo timestamp={time} />
			}
		],
		[t]
	);

	return (
		<div style={{ padding: '24px 16px' }}>
			<Title level={2} style={{ marginBottom: 24 }}>
				{t('home.heading')}
			</Title>
			<title>{t('home.pageTitle')}</title>

			<Row gutter={[16, 16]} justify="center" style={{ marginBottom: 32 }}>
				<Col xs={24} sm={12} lg={4}>
					<StatCard
						label={t('home.stat.blockHeight')}
						value={stats?.blockHeight}
						loading={statsLoading}
						icon={<BlockOutlined />}
					/>
				</Col>
				<Col xs={24} sm={12} lg={4}>
					<StatCard
						label={t('home.stat.hashrate')}
						value={stats?.hashrate}
						loading={statsLoading}
						icon={<ThunderboltOutlined />}
					/>
				</Col>
				<Col xs={24} sm={12} lg={4}>
					<StatCard
						label={t('home.stat.difficulty')}
						value={stats?.difficulty}
						loading={statsLoading}
						icon={<AimOutlined />}
					/>
				</Col>
				<Col xs={24} sm={12} lg={4}>
					<StatCard
						label={t('home.stat.supply')}
						value={stats?.supply}
						loading={statsLoading}
						icon={<DollarOutlined />}
					/>
				</Col>
				<Col xs={24} sm={12} lg={4}>
					<StatCard
						label={t('home.stat.transactions')}
						value={stats?.txCount}
						loading={statsLoading}
						icon={<SwapOutlined />}
					/>
				</Col>
			</Row>

			<Row gutter={[24, 24]}>
				<Col xs={24} xl={12}>
					<Title level={4}>{t('home.latestBlocks')}</Title>
					<Table<BlockSummaryDto>
						dataSource={blocks}
						columns={blockColumns}
						rowKey="hash"
						loading={blocksLoading}
						pagination={false}
						size="small"
						scroll={{ x: true }}
						className="pointer"
						onRow={(row) => ({ onClick: () => navigate(`/block/${row.height}`) })}
					/>
				</Col>
				<Col xs={24} xl={12}>
					<Title level={4}>{t('home.latestTransactions')}</Title>
					<Table
						dataSource={txs}
						columns={txColumns}
						rowKey="txid"
						loading={txsLoading}
						pagination={false}
						size="small"
						scroll={{ x: true }}
						className="pointer"
						onRow={(row) => ({ onClick: () => navigate(`/tx/${row.txid}`) })}
					/>
				</Col>
			</Row>
		</div>
	);
}
