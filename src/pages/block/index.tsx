import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Typography, Table, Card, Tag, Row, Col, Skeleton } from 'antd';
import { useBlockDetail } from '@/hooks/useBlock';
import HashDisplay from '@/components/HashDisplay';
import HashLink from '@/components/HashLink';
import type { TransactionType } from '@/types/dto';

const { Title, Text } = Typography;

const TX_TYPE_COLORS: Record<TransactionType, string> = {
	transparent: 'default',
	spark: 'error',
	coinbase: 'warning',
	unknown: 'default'
};

const formatSize = (bytes: number) => `${(bytes / 1024).toFixed(2)} KB`;

export default function Block() {
	const { hash } = useParams<{ hash: string }>();
	const { data: block, isLoading, isError } = useBlockDetail(hash ?? '');
	const navigate = useNavigate();

	if (isError) {
		return <Text type="danger">Block not found.</Text>;
	}

	const details = block
		? [
				{ label: 'Height', value: block.height.toLocaleString() },
				{ label: 'Confirmations', value: block.confirmations.toLocaleString() },
				{ label: 'Timestamp', value: new Date(block.time * 1000).toLocaleString() },
				{ label: 'Transactions', value: block.nTx.toLocaleString() },
				{ label: 'Size', value: formatSize(block.size) },
				{ label: 'Difficulty', value: block.difficulty.toFixed(0) },
				{ label: 'Chainlock', value: block.chainlock ? 'Yes' : 'No' },
				{ label: 'Previous Block', value: block.previousBlockHash, isHash: true },
				...(block.nextBlockHash
					? [{ label: 'Next Block', value: block.nextBlockHash, isHash: true }]
					: [])
			]
		: [];

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
		}
	];

	const title = isLoading
		? 'FiroBlocks — Firo Block Explorer'
		: `FiroBlocks — Block #${block!.hash}`;

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
			<div>
				<Title level={3}>Block</Title>
				<title>{title}</title>

				{isLoading ? (
					<Skeleton.Input active style={{ width: 500 }} />
				) : (
					block && <HashDisplay value={block.hash} truncate={false} />
				)}
			</div>

			<Card title="Block Details">
				{isLoading ? (
					<Skeleton active />
				) : (
					<div style={{ overflowX: 'auto' }}>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<tbody>
								{details.map(({ label, value, isHash }) => (
									<tr key={label}>
										<td
											style={{
												padding: '8px 16px 8px 0',
												width: 180,
												verticalAlign: 'top',
												whiteSpace: 'nowrap'
											}}
										>
											<Text type="secondary">{label}</Text>
										</td>
										<td
											style={{
												padding: '8px 0',
												fontFamily: 'monospace',
												wordBreak: 'break-all'
											}}
										>
											{isHash && value ? (
												<HashDisplay value={value} />
											) : (
												<Text>{value}</Text>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</Card>

			<Card title="Transactions">
				<Table
					dataSource={block?.txids.map((txid) => ({
						txid,
						type: 'unknown' as TransactionType
					}))}
					columns={txColumns}
					rowKey="txid"
					loading={isLoading}
					pagination={false}
					size="small"
					scroll={{ x: true }}
					onRow={(row) => ({ onClick: () => navigate(`/tx/${row.txid}`) })}
				/>
			</Card>

			{!isLoading && block && (
				<Row justify="space-between">
					<Col>
						<Link to={`/block/${block.previousBlockHash}`} style={{ color: '#ba2a45' }}>
							<ArrowLeftOutlined /> Previous Block
						</Link>
					</Col>
					{block.nextBlockHash && (
						<Col>
							<Link to={`/block/${block.nextBlockHash}`} style={{ color: '#ba2a45' }}>
								Next Block <ArrowRightOutlined />
							</Link>
						</Col>
					)}
				</Row>
			)}
		</div>
	);
}
