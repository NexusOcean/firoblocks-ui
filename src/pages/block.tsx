import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom';
import { Typography, Table, Card, Tag, Row, Col, Skeleton } from 'antd';
import { useBlockDetail } from '@/hooks/useBlock';
import HashDisplay from '@/components/HashDisplay';
import HashLink from '@/components/HashLink';
import type { TransactionType } from '@/types/dto';
import { useTranslation } from 'react-i18next';
import { TX_TYPE_COLORS } from '@/types';

const { Title, Text } = Typography;

export default function Block() {
	const { height } = useParams<{ height: string }>();
	const { data: block, isLoading, isError } = useBlockDetail(height ?? '');
	const navigate = useNavigate();
	const { t } = useTranslation();

	if (!height || !/^\d+$/.test(height)) return <Navigate to="/404" />;
	if (isError) return <Navigate to="/maintenance" />;

	const formatSize = (bytes: number) => `${(bytes / 1024).toFixed(2)} ${t('labels.kilobytes')}`;

	const details = block
		? [
				{
					label: t('labels.height'),
					value: <HashDisplay value={block.height.toLocaleString()} truncate={false} />
				},
				{ label: t('labels.confirmations'), value: block.confirmations.toLocaleString() },
				{
					label: t('labels.timestamp'),
					value: new Date(block.time * 1000).toLocaleString()
				},
				{ label: t('labels.transactions'), value: block.nTx.toLocaleString() },
				{ label: t('labels.size'), value: formatSize(block.size) },
				{ label: t('labels.difficulty'), value: block.difficulty.toFixed(0) },
				{
					label: t('labels.chainlock'),
					value: block.chainlock ? t('labels.yes') : t('labels.no')
				}
			]
		: [];

	const txColumns = [
		{
			title: t('labels.txid'),
			dataIndex: 'txid',
			key: 'txid',
			render: (id: string) => <HashLink value={id} to={`/tx/${id}`} truncate />
		},
		{
			title: t('labels.type'),
			dataIndex: 'type',
			key: 'type',
			render: (type: TransactionType) => (
				<Tag color={TX_TYPE_COLORS[type]}>
					{`${type.charAt(0).toLocaleUpperCase()}${type.slice(1)}`}
				</Tag>
			)
		}
	];

	const title = isLoading
		? t('titles.firoblockWithNoBlockNumber')
		: t('titles.firoblockWithBlockNumber', { height: block?.height });

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
			<div>
				<Title level={3}>{t('titles.block')}</Title>
				<title>{title}</title>

				{isLoading ? (
					<Skeleton.Input active style={{ width: 500 }} />
				) : (
					block && <HashDisplay value={block.hash} truncate={false} copy={false} />
				)}
			</div>

			<Card title={t('titles.blockDetails')}>
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

			<Card title={t('titles.transactions')}>
				<Table
					dataSource={block?.txids.map((txid) => ({
						txid,
						type: 'unknown' as TransactionType
					}))}
					columns={txColumns}
					loading={isLoading}
					pagination={false}
					size="small"
					scroll={{ x: true }}
					className="pointer"
					rowKey={(row) => row.txid}
					onRow={(row) => ({ onClick: () => navigate(`/tx/${row.txid}`) })}
				/>
			</Card>

			{!isLoading && block && (
				<Row justify="space-between">
					<Col>
						<Link to={`/block/${block.previousBlockHeight}`} className="block-nav">
							<ArrowLeftOutlined className="arrow-left" />
							{t('links.previousBlock')}
						</Link>
					</Col>
					{block.nextBlockHeight && (
						<Col>
							<Link to={`/block/${block.nextBlockHeight}`} className="block-nav">
								{t('links.nextBlock')}
								<ArrowRightOutlined className="arrow-right" />
							</Link>
						</Col>
					)}
				</Row>
			)}
		</div>
	);
}
