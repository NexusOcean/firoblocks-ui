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

const { Title } = Typography;

const TX_TYPE_COLORS: Record<TransactionType | 'coinbase' | 'unknown', string> = {
	transparent: 'default',
	spark: 'error',
	coinbase: 'warning',
	unknown: 'default'
};

const blockColumns = [
	{
		title: 'Height',
		dataIndex: 'height',
		key: 'height',
		render: (h: number) => <HashLink value={String(h)} to={`/block/${h}`} mono />
	},
	{
		title: 'Hash',
		dataIndex: 'hash',
		key: 'hash',
		render: (h: string) => <HashLink value={h} to={`/block/${h}`} truncate />
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
		dataIndex: 'type',
		key: 'type',
		render: (type: TransactionType) => <Tag color={TX_TYPE_COLORS[type]}>{type}</Tag>
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

	return (
		<div style={{ padding: '24px 32px' }}>
			<Title level={2} style={{ marginBottom: 24 }}>
				FiroBlocks
			</Title>
			<title>FiroBlocks — Firo Block Explorer</title>

			<Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
				<Col xs={24} sm={12} lg={4} offset={2}>
					<StatCard
						label="Block Height"
						value={stats?.blockHeight}
						loading={statsLoading}
						icon={<BlockOutlined />}
					/>
				</Col>
				<Col xs={24} sm={12} lg={4}>
					<StatCard
						label="Hashrate"
						value={stats?.hashrate}
						loading={statsLoading}
						icon={<ThunderboltOutlined />}
					/>
				</Col>
				<Col xs={24} sm={12} lg={4}>
					<StatCard
						label="Difficulty"
						value={stats?.difficulty}
						loading={statsLoading}
						icon={<AimOutlined />}
					/>
				</Col>
				<Col xs={24} sm={12} lg={4}>
					<StatCard
						label="Supply"
						value={stats?.supply}
						loading={statsLoading}
						icon={<DollarOutlined />}
					/>
				</Col>
				<Col xs={24} sm={12} lg={4}>
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
					/>
				</Col>
			</Row>
		</div>
	);
}
