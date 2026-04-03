import { useMemo } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Typography, Card, Table, Tag, Row, Col, Skeleton } from 'antd';
import { useTransactionDetail } from '@/hooks/useTransaction';
import HashDisplay, { truncateHash } from '@/components/HashDisplay';
import HashLink from '@/components/HashLink';
import type { TransactionType, TxVinDto, TxVoutDto } from '@/types/dto';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const TX_TYPE_COLORS: Record<TransactionType, string> = {
	transparent: 'default',
	spark: 'error',
	coinbase: 'warning',
	unknown: 'default'
};

export default function Transaction() {
	const { t } = useTranslation();
	const { txid } = useParams<{ txid: string }>();
	const { data: tx, isLoading, isError } = useTransactionDetail(txid ?? '');
	const navigate = useNavigate();

	const inputColumns = useMemo(
		() => [
			{
				title: t('table.address'),
				dataIndex: 'address',
				key: 'address',
				render: (_: unknown, row: TxVinDto) =>
					row.address ? (
						<HashLink value={row.address} to={`/address/${row.address}`} truncate />
					) : (
						<Text type="secondary" italic>
							{row.coinbase ? t('tx.coinbase') : t('tx.anonymizedInput')}
						</Text>
					)
			},
			{
				title: t('table.value'),
				dataIndex: 'value',
				key: 'value',
				render: (v?: number) => <Text>{v != null ? `${v.toFixed(2)} FIRO` : '—'}</Text>
			}
		],
		[t]
	);

	const outputColumns = useMemo(
		() => [
			{
				title: t('table.address'),
				dataIndex: 'addresses',
				key: 'addresses',
				render: (addresses: string[]) =>
					addresses?.length ? (
						<HashLink value={addresses[0]} to={`/address/${addresses[0]}`} truncate />
					) : (
						<Text type="secondary" italic>
							{t('tx.anonymizedOutput')}
						</Text>
					)
			},
			{
				title: t('table.type'),
				dataIndex: 'type',
				key: 'type',
				render: (type: string) => <Tag>{type}</Tag>
			},
			{
				title: t('table.value'),
				dataIndex: 'value',
				key: 'value',
				render: (v: number) => `${v.toFixed(2)} FIRO`
			}
		],
		[t]
	);

	if (!txid || !/^[a-fA-F0-9]{64}$/.test(txid)) return <Navigate to="/404" />;

	if (isError) return <Navigate to="/maintenance" />;

	const valueOut = tx?.vout.reduce((sum, o) => sum + o.value, 0);

	const details = tx
		? [
				{
					label: t('tx.detail.blockHeight'),
					value: tx.blockHeight.toLocaleString(),
					isHeight: true,
					link: `/block/${tx.blockHeight}`
				},
				{
					label: t('tx.detail.blockHash'),
					value: truncateHash(tx.blockHash)
				},
				{ label: t('tx.detail.confirmations'), value: tx.confirmations.toLocaleString() },
				{
					label: t('tx.detail.timestamp'),
					value: new Date(tx.time * 1000).toLocaleString()
				},
				{ label: t('tx.detail.size'), value: `${tx.size.toLocaleString()} bytes` },
				{
					label: t('tx.detail.fee'),
					value: tx.fee != null ? `${tx.fee.toFixed(2)} FIRO` : '—'
				},
				{ label: t('tx.detail.totalOutput'), value: `${valueOut?.toFixed(2)} FIRO` },
				{
					label: t('tx.detail.chainlock'),
					value: tx.chainlock ? t('common.yes') : t('common.no')
				}
			]
		: [];

	const title = isLoading ? t('tx.pageTitle') : t('tx.pageTitleWithTxid', { txid: tx!.txid });

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
			<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
				<Title level={3} style={{ margin: 0 }}>
					{t('tx.heading')}
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

			<Card title={t('tx.detailsTitle')}>
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
					<Card title={tx ? `${t('tx.inputs')} (${tx.vin.length})` : t('tx.inputs')}>
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
					<Card title={tx ? `${t('tx.outputs')} (${tx.vout.length})` : t('tx.outputs')}>
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
