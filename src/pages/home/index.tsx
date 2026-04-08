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
import { TX_CATEGORY_LABELS, TX_CATEGORY_COLORS } from '@/types';
import type { TransactionCategory, BlockSummaryDto } from '@/types/dto';

const { Title } = Typography;

const blockColumns = [
	{
		title: 'Height',
		dataIndex: 'height',
		key: 'height',
		render: (h: number) => <HashLink value={h.toLocaleString()} to={`/block/${h}`} mono />
	},
	{
		title: 'Hash',
		dataIndex: 'hash',
		key: 'hash',
		render: (h: string) => <span style={{ color: '#ba2a45' }}>{truncateHash(h)}</span>
	},
	{ title: 'Txs', dataIndex: 'nTx', key: 'nTx' },
	{
		title: 'Size',
		dataIndex: 'size',
		key: 'size',
		render: (s: number) => `${(s / 1024).toFixed(1)} KB`
	},
	{
		title: 'Age',
		dataIndex: 'time',
		key: 'time',
		render: (t: number) => <TimeAgo timestamp={t} />
	}
];

const txColumns = [
	{
		title: 'Txid',
		dataIndex: 'txid',
		key: 'txid',
		render: (id: string) => <HashLink value={id} to={`/tx/${id}`} truncate />
	},
	{
		title: 'Type',
		dataIndex: 'category',
		key: 'category',
		render: (c: TransactionCategory) => (
			<Tag color={TX_CATEGORY_COLORS[c]}>{TX_CATEGORY_LABELS[c]}</Tag>
		)
	},
	{
		title: 'Value',
		dataIndex: 'valueOut',
		key: 'valueOut',
		render: (v: string) => `${v} FIRO`
	},
	{
		title: 'Age',
		dataIndex: 'time',
		key: 'time',
		render: (t: number) => <TimeAgo timestamp={t} />
	}
];

export default function Home() {
	const { data: stats, isLoading: statsLoading } = useNetworkStats();
	const { data: blocks, isLoading: blocksLoading } = useLatestBlocks();
	const { data: txs, isLoading: txsLoading } = useLatestTransactions();
	const navigate = useNavigate();

	return (
		<div style={{ padding: '24px 16px' }}>
			<Title level={2} style={{ marginBottom: 24 }}>
				FiroBlocks
			</Title>
			<title>FiroBlocks — Firo Block Explorer</title>

			<Row gutter={[16, 16]} justify="center" style={{ marginBottom: 32 }}>
				<Col xs={24} sm={12} lg={5} xl={4}>
					<StatCard
						label="Block Height"
						value={stats?.blockHeight}
						loading={statsLoading}
						icon={<BlockOutlined />}
					/>
				</Col>
				<Col xs={24} sm={12} lg={5} xl={4}>
					<StatCard
						label="Hashrate"
						value={stats?.hashrate}
						loading={statsLoading}
						icon={<ThunderboltOutlined />}
					/>
				</Col>
				<Col xs={24} sm={12} lg={5} xl={4}>
					<StatCard
						label="Difficulty"
						value={stats?.difficulty}
						loading={statsLoading}
						icon={<AimOutlined />}
					/>
				</Col>
				<Col xs={24} sm={12} lg={5} xl={4}>
					<StatCard
						label="Block Time"
						value={stats?.avgBlockTime}
						loading={statsLoading}
						icon={<ClockCircleOutlined />}
					/>
				</Col>
				<Col xs={24} sm={12} lg={5} xl={4}>
					<StatCard
						label="FIRO Supply"
						value={stats?.supply}
						loading={statsLoading}
						icon={<DollarOutlined />}
					/>
				</Col>
				<Col xs={24} sm={12} lg={5} xl={4}>
					<StatCard
						label="Transactions"
						value={stats?.txCount}
						loading={statsLoading}
						icon={<SwapOutlined />}
					/>
				</Col>
			</Row>

			<Row gutter={[24, 24]}>
				<Col xs={24} xl={12}>
					<Title level={4}>Latest Blocks</Title>
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
					<Title level={4}>Latest Transactions</Title>
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
