import { Typography, Row, Col, Table, Tag, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLatestBlocks, useLatestTransactions } from '@/hooks/useStats';
import HashLink from '@/components/HashLink';
import TimeAgo from '@/components/TimeAgo';
import { truncateHash } from '@/components/HashDisplay';
import type { BlockSummaryDto, TransactionCategory } from '@/types/dto';
import { TX_CATEGORY_COLORS, TX_CATEGORY_LABELS } from '@/types';

const { Title, Text } = Typography;

export default function RecentTables() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { data: blocks, isLoading: blocksLoading } = useLatestBlocks();
	const { data: txs, isLoading: txsLoading } = useLatestTransactions();

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
		<>
			<Row gutter={[24, 24]}>
				<Col>
					<Title level={3} style={{ color: '#ba2a45' }}>
						{t('labels.activity')}
					</Title>
				</Col>
			</Row>
			<Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
				<Col xs={24} xl={12}>
					<Text style={{ fontSize: 24, fontWeight: 600 }}>
						{t('titles.latestBlocks')}
					</Text>
					<Divider style={{ margin: '8px 0' }} />
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
					<Text style={{ fontSize: 24, fontWeight: 600 }}>
						{t('titles.latestTransactions')}
					</Text>
					<Divider style={{ margin: '8px 0' }} />
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
		</>
	);
}
