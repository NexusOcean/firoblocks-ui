import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Typography, Card, Table, Tag, Skeleton, Pagination } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { useAddressDetail } from '@/hooks/useAddress';
import HashDisplay from '@/components/HashDisplay';
import HashLink from '@/components/HashLink';
import TimeAgo from '@/components/TimeAgo';
import type { AddressTxSummaryDto, TransactionType } from '@/types/dto';
import { formatFiro } from '@/utils';
import { TX_TYPE_COLORS } from '@/types';

const { Title, Text } = Typography;

export default function Address() {
	const { address } = useParams<{ address: string }>();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const page = parseInt(searchParams.get('page') ?? '1', 10);
	const limit = parseInt(searchParams.get('limit') ?? '10');
	const { data, isLoading, isError } = useAddressDetail(address ?? '', page, limit);

	if (!address || !/^[a4][1-9A-HJ-NP-Za-km-z]{25,40}$/.test(address)) {
		return <Navigate to="/404" />;
	}

	if (isError) return <Navigate to="/maintenance" />;

	const handleSetPage = (newPage: number, newLimit: number) => {
		setSearchParams({ page: String(newPage), limit: String(newLimit) });
	};

	const details = data
		? [
				{ label: 'Balance', value: `${formatFiro(data.balance)} FIRO` },
				{ label: 'Total Received', value: `${formatFiro(data.received)} FIRO` },
				{
					label: 'Recent Transactions',
					value: data.totalTxCount >= 1000 ? '1,000' : data.totalTxCount.toLocaleString()
				}
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
			render: (type: TransactionType) => (
				<Tag color={TX_TYPE_COLORS[type]}>
					{`${type.charAt(0).toLocaleUpperCase()}${type.slice(1)}`}
				</Tag>
			)
		},
		{
			title: 'Value',
			dataIndex: 'valueDelta',
			key: 'valueDelta',
			render: (v?: number) =>
				v != null ? (
					<Text
						style={{
							color: v > 0.01 ? '#52c41a' : 'var(--ant-color-text-description)'
						}}
					>
						{v >= 0 ? '+' : ''}
						{`${!formatFiro(v).includes('<') ? formatFiro(v) : '—'}`}
					</Text>
				) : (
					'—'
				)
		},
		{
			title: 'Age',
			dataIndex: 'time',
			key: 'time',
			render: (t: number) => <TimeAgo timestamp={t} />
		}
	];

	const title = isLoading
		? 'FiroBlocks — Firo Block Explorer'
		: `FiroBlocks — Address ${data!.address}`;

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
			<div>
				<Title level={3}>Address</Title>
				<title>{title}</title>

				{isLoading ? (
					<Skeleton.Input active style={{ width: 500 }} />
				) : (
					data && <HashDisplay value={data.address} truncate={false} />
				)}
			</div>

			<Card title="Address Details">
				{isLoading ? (
					<Skeleton active />
				) : (
					<div style={{ overflowX: 'auto' }}>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<tbody>
								{details.map(({ label, value }) => (
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
											<Text>{value}</Text>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</Card>

			<Card title={`Transactions${data ? ` (${data.totalTxCount.toLocaleString()})` : ''}`}>
				<Table<AddressTxSummaryDto>
					dataSource={data?.transactions}
					columns={txColumns}
					rowKey="txid"
					loading={isLoading}
					pagination={false}
					size="small"
					scroll={{ x: true }}
					className="pointer"
					onRow={(row) => ({ onClick: () => navigate(`/tx/${row.txid}`) })}
				/>
				{data && data.totalPages > 1 && (
					<div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
						<Pagination
							current={page}
							total={data.totalTxCount}
							pageSize={limit}
							onChange={handleSetPage}
							showSizeChanger={true}
							pageSizeOptions={[5, 10, 20]}
						/>
					</div>
				)}
			</Card>
		</div>
	);
}
