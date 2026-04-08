import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Typography, Card, Table, Tag, Row, Col, Skeleton } from 'antd';
import { useTransactionDetail } from '@/hooks/useTransaction';
import HashDisplay, { truncateHash } from '@/components/HashDisplay';
import HashLink from '@/components/HashLink';
import type { TxVinDto, TxVoutDto } from '@/types/dto';
import { formatFiro } from '@/utils';
import { TX_TYPE_COLORS, VIN_KIND_LABELS, VOUT_KIND_COLORS, VOUT_KIND_LABELS } from '@/types';

const { Title, Text } = Typography;

const inputColumns = [
	{
		title: 'Address',
		dataIndex: 'address',
		key: 'address',
		render: (_: unknown, row: TxVinDto) =>
			row.address ? (
				<HashLink value={row.address} to={`/address/${row.address}`} truncate />
			) : (
				<Text type="secondary" italic>
					{VIN_KIND_LABELS[row.kind]}
				</Text>
			)
	},
	{
		title: 'Value',
		dataIndex: 'value',
		key: 'value',
		render: (v?: number) => <Text>{v != null ? `${v.toFixed(2)} FIRO` : '—'}</Text>
	}
];

const outputColumns = [
	{
		title: 'Address',
		dataIndex: 'addresses',
		key: 'addresses',
		render: (_: unknown, row: TxVoutDto) =>
			row.addresses?.length ? (
				<HashLink value={row.addresses[0]} to={`/address/${row.addresses[0]}`} truncate />
			) : (
				<Text type="secondary" italic>
					{VOUT_KIND_LABELS[row.kind]}
				</Text>
			)
	},
	{
		title: 'Type',
		dataIndex: 'kind',
		key: 'kind',
		render: (_: unknown, row: TxVoutDto) => (
			<Tag color={VOUT_KIND_COLORS[row.kind]}>{VOUT_KIND_LABELS[row.kind]}</Tag>
		)
	},
	{
		title: 'Value',
		dataIndex: 'value',
		key: 'value',
		render: (v: number) => `${formatFiro(v)} FIRO`
	}
];

export default function Transaction() {
	const { txid } = useParams<{ txid: string }>();
	const { data: tx, isLoading, isError } = useTransactionDetail(txid ?? '');
	const navigate = useNavigate();

	if (!txid || !/^[a-fA-F0-9]{64}$/.test(txid)) return <Navigate to="/404" />;

	if (isError) return <Navigate to="/maintenance" />;

	const valueOut = tx?.vout.reduce((sum, o) => sum + o.value, 0);

	const details = tx
		? [
				{
					label: 'Block Height',
					value: tx.blockHeight.toLocaleString(),
					isHeight: true,
					link: `/block/${tx.blockHeight}`
				},
				{
					label: 'Block Hash',
					value: truncateHash(tx.blockHash)
				},
				{ label: 'Confirmations', value: tx.confirmations.toLocaleString() },
				{ label: 'Timestamp', value: new Date(tx.time * 1000).toLocaleString() },
				{ label: 'Size', value: `${tx.size.toLocaleString()} bytes` },
				{
					label: 'Fee',
					value: tx.fee ? `${formatFiro(tx.fee)} FIRO` : '—'
				},
				{
					label: 'Total Output',
					value: valueOut ? `${formatFiro(valueOut)}  FIRO` : '—'
				},
				{ label: 'Chainlock', value: tx.chainlock ? 'Yes' : 'No' }
			]
		: [];

	const title = isLoading
		? 'FiroBlocks — Firo Block Explorer'
		: `FiroBlocks — Transaction ${tx!.txid}`;

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
			<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
				<Title level={3} style={{ margin: 0 }}>
					Transaction
				</Title>
				<title>{title}</title>

				{isLoading ? (
					<Skeleton.Input active style={{ width: 80 }} />
				) : (
					tx && (
						<Tag color={TX_TYPE_COLORS[tx.type]}>
							{`${tx.type.charAt(0).toLocaleUpperCase()}${tx.type.slice(1)}`}
						</Tag>
					)
				)}
			</div>

			{isLoading ? (
				<Skeleton.Input active style={{ width: 500 }} />
			) : (
				tx && <HashDisplay value={tx.txid} truncate={false} />
			)}

			<Card title="Transaction Details">
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
					<Card title={`Inputs${tx ? ` (${tx.vin.length})` : ''}`}>
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
					<Card title={`Outputs${tx ? ` (${tx.vout.length})` : ''}`}>
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
