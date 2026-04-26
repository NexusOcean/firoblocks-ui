import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Typography, Card, Table, Tag, Skeleton, Pagination } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { useAddressDetail } from '@/hooks/useAddress';
import HashDisplay from '@/components/HashDisplay';
import HashLink from '@/components/HashLink';
import TimeAgo from '@/components/TimeAgo';
import type { AddressTxSummaryDto, TransactionType } from '@/types/dto';
import { formatFiro } from '@/utils';
import { useTranslation } from 'react-i18next';
import { TX_TYPE_COLORS } from '@/types';

const { Title, Text } = Typography;

export default function Address() {
	const { address } = useParams<{ address: string }>();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [searchParams, setSearchParams] = useSearchParams();
	const page = parseInt(searchParams.get('page') ?? '1', 10);
	const limit = parseInt(searchParams.get('limit') ?? '10');
	const { data, isLoading, isError } = useAddressDetail(address ?? '', page, limit);
	const txCountSuffix = data
		? ` (${data.totalTxCount > 1000 ? t('labels.oneThousandPlus') : data.totalTxCount.toLocaleString()})`
		: '';

	if (!address || !/^[aZ34][1-9A-HJ-NP-Za-km-z]{25,40}$/.test(address)) {
		return <Navigate to="/404" />;
	}

	if (isError) return <Navigate to="/maintenance" />;

	const handleSetPage = (newPage: number, newLimit: number) => {
		setSearchParams({ page: String(newPage), limit: String(newLimit) });
	};

	const details = data
		? [
				{ label: t('labels.balance'), value: `${formatFiro(data.balance)} FIRO` },
				{ label: t('labels.totalReceived'), value: `${formatFiro(data.received)} FIRO` },
				{
					label: t('labels.recent'),
					value:
						data.totalTxCount >= 1000
							? t('labels.oneThousandPlus')
							: data.totalTxCount.toLocaleString()
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
		},
		{
			title: t('labels.value'),
			dataIndex: 'valueDelta',
			key: 'valueDelta',
			render: (v?: number) =>
				v != null ? (
					<Text
						style={{
							color: v > 0.01 ? '#52c41a' : 'var(--ant-color-text-description)'
						}}
					>
						{v >= 0.01 ? '+' : ''}
						{`${formatFiro(v)}`}
					</Text>
				) : (
					'—'
				)
		},
		{
			title: t('labels.age'),
			dataIndex: 'time',
			key: 'time',
			render: (t: number) => <TimeAgo timestamp={t} />
		}
	];

	const title = isLoading
		? t('titles.firoblockWithAddress')
		: t('titles.firoblockWithAddressNumber', { address: data!.address });

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
			<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
				<Title level={3} style={{ margin: 0 }}>
					{t('titles.address')}
				</Title>
				<title>
					${t('titles.firoblock')} — {title}
				</title>
			</div>

			{isLoading ? (
				<Skeleton.Input active style={{ width: 500 }} />
			) : (
				data && <HashDisplay value={data.address} truncate={false} />
			)}

			<Card title={t('titles.addressDetails')}>
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

			<Card title={t('titles.transactionsWithCount', { len: txCountSuffix })}>
				<Table<AddressTxSummaryDto>
					dataSource={data?.transactions}
					columns={txColumns}
					loading={isLoading}
					pagination={false}
					size="small"
					scroll={{ x: true }}
					className="pointer"
					rowKey={(row) => row.txid}
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
							showLessItems
						/>
					</div>
				)}
			</Card>
		</div>
	);
}
