import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom';
import { Typography, Table, Card, Tag, Row, Col, Skeleton } from 'antd';
import { useBlockDetail } from '@/hooks/useBlock';
import HashDisplay from '@/components/HashDisplay';
import HashLink from '@/components/HashLink';
import type { TransactionType } from '@/types/dto';
import { TX_TYPE_COLORS } from '@/types';

const { Title, Text } = Typography;

const formatSize = (bytes: number) => `${(bytes / 1024).toFixed(2)} KB`;

export default function Block() {
	const { height } = useParams<{ height: string }>();
	const { data: block, isLoading, isError } = useBlockDetail(height ?? '');
	const navigate = useNavigate();

	if (!height || !/^\d+$/.test(height)) return <Navigate to="/404" />;

	if (isError) return <Navigate to="/maintenance" />;

	const details = block
		? [
				{
					label: 'Height',
					value: <HashDisplay value={block.height.toLocaleString()} truncate={false} />
				},
				{ label: 'Confirmations', value: block.confirmations.toLocaleString() },
				{ label: 'Timestamp', value: new Date(block.time * 1000).toLocaleString() },
				{ label: 'Transactions', value: block.nTx.toLocaleString() },
				{ label: 'Size', value: formatSize(block.size) },
				{ label: 'Difficulty', value: block.difficulty.toFixed(0) },
				{ label: 'Chainlock', value: block.chainlock ? 'Yes' : 'No' }
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
		: `FiroBlocks — Block #${block?.height}`;

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
			<div>
				<Title level={3}>Block</Title>
				<title>{title}</title>

				{isLoading ? (
					<Skeleton.Input active style={{ width: 500 }} />
				) : (
					block && <HashDisplay value={block.hash} truncate={false} copy={false} />
				)}
			</div>

			<Card title="Block Details">
				{isLoading ? (
					<Skeleton active />
				) : (
					<div style={{ overflowX: 'auto' }}>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<tbody>
								{details.map(({ label, value }) => (
									<tr key={label} style={{ width: 360 }}>
										<td
											style={{
												padding: '8px 16px 8px 0',
												verticalAlign: 'top',
												width: 180,
												whiteSpace: 'nowrap'
											}}
										>
											<Text type="secondary">{label}</Text>
										</td>
										<td
											style={{
												padding: '8px 0',
												fontFamily: 'monospace',
												wordWrap: 'break-word'
											}}
										>
											<Text>{value}</Text>
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
					className="pointer"
					onRow={(row) => ({ onClick: () => navigate(`/tx/${row.txid}`) })}
				/>
			</Card>

			{!isLoading && block && (
				<Row justify="space-between">
					<Col>
						<Link to={`/block/${block.previousBlockHeight}`} className="block-nav">
							<ArrowLeftOutlined className="arrow-left" />
							Previous Block
						</Link>
					</Col>
					{block.nextBlockHeight && (
						<Col>
							<Link to={`/block/${block.nextBlockHeight}`} className="block-nav">
								Next Block
								<ArrowRightOutlined className="arrow-right" />
							</Link>
						</Col>
					)}
				</Row>
			)}
		</div>
	);
}
