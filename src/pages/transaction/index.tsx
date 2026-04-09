import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Typography, Card, Table, Tag, Row, Col, Skeleton } from 'antd';
import { useTransactionDetail } from '@/hooks/useTransaction';
import HashDisplay, { truncateHash } from '@/components/HashDisplay';
import HashLink from '@/components/HashLink';
import type { TxVinDto, TxVoutDto } from '@/types/dto';
import { formatFiro, TX_TYPE_COLORS } from '@/utils';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

export default function Transaction() {
	const { txid } = useParams<{ txid: string }>();
	const { data: tx, isLoading, isError } = useTransactionDetail(txid ?? '');
	const navigate = useNavigate();
	const { t } = useTranslation();

	if (!txid || !/^[a-fA-F0-9]{64}$/.test(txid)) return <Navigate to="/404" />;
	if (isError) return <Navigate to="/maintenance" />;

	const valueOut = tx?.vout.reduce((sum, output) => sum + output.value, 0);

	const inputColumns = [
		{
			title: t('labels.address'),
			dataIndex: 'address',
			key: 'address',
			render: (_: unknown, row: TxVinDto) =>
				row.address ? (
					<HashLink value={row.address} to={`/address/${row.address}`} truncate />
				) : (
					<Text type="secondary" italic>
						{row.coinbase ? t('labels.coinbase') : t('labels.anonymizedInput')}
					</Text>
				)
		},
		{
			title: t('labels.value'),
			dataIndex: 'value',
			key: 'value',
			render: (v?: number) => <Text>{v != null ? `${v.toFixed(2)} FIRO` : '—'}</Text>
		}
	];

	const outputColumns = [
		{
			title: t('labels.address'),
			dataIndex: 'addresses',
			key: 'addresses',
			render: (addresses: string[]) =>
				addresses?.length ? (
					<HashLink value={addresses[0]} to={`/address/${addresses[0]}`} truncate />
				) : (
					<Text type="secondary" italic>
						{t('labels.anonymizedOutput')}
					</Text>
				)
		},
		{
			title: t('labels.type'),
			dataIndex: 'type',
			key: 'type',
			render: (type: string) => <Tag>{type}</Tag>
		},
		{
			title: t('labels.value'),
			dataIndex: 'value',
			key: 'value',
			render: (v: number) => `${formatFiro(v)} FIRO`
		}
	];

	const details = tx
		? [
				{
					label: t('labels.blockHeight'),
					value: tx.blockHeight.toLocaleString(),
					isHeight: true,
					link: `/block/${tx.blockHeight}`
				},
				{
					label: t('labels.blockhash'),
					value: truncateHash(tx.blockHash)
				},
				{ label: t('labels.confirmations'), value: tx.confirmations.toLocaleString() },
				{ label: t('labels.timestamp'), value: new Date(tx.time * 1000).toLocaleString() },
				{
					label: t('labels.size'),
					value: `${tx.size.toLocaleString()} ${t('labels.bytes')}`
				},
				{ label: t('labels.fee'), value: tx.fee ? `${formatFiro(tx.fee)} FIRO` : '—' },
				{
					label: t('labels.totalOutput'),
					value: valueOut ? `${formatFiro(valueOut)} FIRO` : '—'
				},
				{
					label: t('labels.chainlock'),
					value: tx.chainlock ? t('labels.yes') : t('labels.no')
				}
			]
		: [];

	const title = isLoading
		? t('titles.firoblockWithNoBlockNumber')
		: t('titles.firoblockWithTransactionNumber', { txid: tx!.txid });

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
			<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
				<Title level={3} style={{ margin: 0 }}>
					{t('titles.transactions')}
				</Title>
				<title>{title}</title>

				{isLoading ? (
					<Skeleton.Input active style={{ width: 80 }} />
				) : (
					tx && <Tag color={TX_TYPE_COLORS[tx.type]}>{tx.type}</Tag>
				)}
			</div>

			{isLoading ? (
				<Skeleton.Input active style={{ width: 500 }} />
			) : (
				tx && <HashDisplay value={tx.txid} truncate={false} />
			)}

			<Card title={t('titles.transactionDetails')}>
				{isLoading ? (
					<Skeleton active />
				) : (
					<div style={{ overflowX: 'auto' }}>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<tbody>
								{details.map(({ label, value, isHeight, link }) => (
									<tr key={label} style={{ width: 360 }}>
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
												wordWrap: 'break-word'
											}}
										>
											{isHeight && value && link ? (
												<HashDisplay value={value} truncate={false} />
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

			<Row gutter={24}>
				<Col xs={24} xl={12}>
					<Card title={t('titles.inputs', { len: tx ? ` (${tx.vin.length})` : '' })}>
						<Table
							dataSource={tx?.vin}
							columns={inputColumns}
							rowKey={(_, i) => String(i)}
							loading={isLoading}
							pagination={false}
							size="small"
							scroll={{ x: true }}
							className="pointer"
							onRow={(row) => ({
								onClick: () => row.address && navigate(`/address/${row.address}`)
							})}
						/>
					</Card>
				</Col>
				<Col xs={24} xl={12}>
					<Card title={t('titles.outputs', { len: tx ? ` (${tx.vout.length})` : '' })}>
						<Table
							dataSource={tx?.vout}
							columns={outputColumns}
							rowKey={(row: TxVoutDto) => String(row.n)}
							loading={isLoading}
							pagination={false}
							size="small"
							scroll={{ x: true }}
							className="pointer"
							onRow={(row) => ({
								onClick: () =>
									row.addresses?.[0] && navigate(`/address/${row.addresses[0]}`)
							})}
						/>
					</Card>
				</Col>
			</Row>
		</div>
	);
}
