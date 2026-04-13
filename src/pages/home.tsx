import { Typography, Row, Col, Table, Tag } from 'antd';
import { useLatestBlocks, useLatestTransactions, useNetworkStats } from '@/hooks/useStats';
import StatCard from '@/components/StatCard';
import HashLink from '@/components/HashLink';
import TimeAgo from '@/components/TimeAgo';
import {
	AimOutlined,
	BlockOutlined,
	ClockCircleOutlined,
	DollarOutlined,
	SwapOutlined,
	ThunderboltOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { truncateHash } from '@/components/HashDisplay';
import { useTranslation } from 'react-i18next';
import type { BlockSummaryDto, TransactionCategory } from '@/types/dto';
import { TX_CATEGORY_COLORS, TX_CATEGORY_LABELS } from '@/types';

const { Title } = Typography;

export default function Home() {
	const { data: stats, isLoading: statsLoading } = useNetworkStats();
	const { data: blocks, isLoading: blocksLoading } = useLatestBlocks();
	const { data: txs, isLoading: txsLoading } = useLatestTransactions();
	const navigate = useNavigate();
	const { t } = useTranslation();

	const blockColumns = [
		{
			title: t('labels.height'),
			dataIndex: 'height',
			key: 'height',
			render: (h: number) => <HashLink value={h.toLocaleString()} to={`/block/${h}`} mono />
		},
		{
			title: t('labels.hash'),
			dataIndex: 'hash',
			key: 'hash',
			render: (h: string) => <span style={{ color: '#ba2a45' }}>{truncateHash(h)}</span>
		},
		{ title: t('labels.txs'), dataIndex: 'nTx', key: 'nTx' },
		{
			title: t('labels.size'),
			dataIndex: 'size',
			key: 'size',
			render: (s: number) => `${(s / 1024).toFixed(1)} ${t('labels.kilobytes')}`
		},
		{
			title: t('labels.age'),
			dataIndex: 'time',
			key: 'time',
			render: (t: number) => <TimeAgo timestamp={t} />
		}
	];

	const txColumns = [
		{
			title: t('labels.txid'),
			dataIndex: 'txid',
			key: 'txid',
			render: (id: string) => <HashLink value={id} to={`/tx/${id}`} truncate />
		},
		{
			title: t('labels.type'),
			dataIndex: 'category',
			key: 'category',
			render: (c: TransactionCategory) => (
				<Tag color={TX_CATEGORY_COLORS[c]}>{TX_CATEGORY_LABELS[c]}</Tag>
			)
		},
		{
			title: t('labels.value'),
			dataIndex: 'valueOut',
			key: 'valueOut',
			render: (v: string) => `${v} FIRO`
		},
		{
			title: t('labels.age'),
			dataIndex: 'time',
			key: 'time',
			render: (t: number) => <TimeAgo timestamp={t} />
		}
	];

	return (
		<div style={{ padding: '24px 16px' }}>
			<Title level={2} style={{ marginBottom: 24, fontFamily: 'monospace' }}>
				{t('titles.firoblock')}
			</Title>
			<title>{t('titles.firoblockWithNoBlockNumber')}</title>

			<Row gutter={[16, 16]} justify="center" style={{ marginBottom: 32 }}>
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

			<Row gutter={[24, 24]}>
				<Col xs={24} xl={12}>
					<Title level={4}>{t('titles.latestBlocks')}</Title>
					<Table<BlockSummaryDto>
						dataSource={blocks}
						columns={blockColumns}
						loading={blocksLoading}
						pagination={false}
						size="small"
						scroll={{ x: true }}
						className="pointer"
						rowKey={(row) => row.height}
						onRow={(row) => ({ onClick: () => navigate(`/block/${row.height}`) })}
					/>
				</Col>
				<Col xs={24} xl={12}>
					<Title level={4}>{t('titles.latestTransactions')}</Title>
					<Table
						dataSource={txs}
						columns={txColumns}
						loading={txsLoading}
						pagination={false}
						size="small"
						scroll={{ x: true }}
						className="pointer"
						rowKey={(row) => row.txid}
						onRow={(row) => ({ onClick: () => navigate(`/tx/${row.txid}`) })}
					/>
				</Col>
			</Row>
		</div>
	);
}
