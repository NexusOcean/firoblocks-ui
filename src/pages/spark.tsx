import { Typography, Card, Table, Tag, Skeleton, Space, Statistic, Alert } from 'antd';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSparkStatus, type SparkEndpoint } from '@/services/spark';
import TimeAgo from '@/components/TimeAgo';

const { Title, Text, Link } = Typography;

const STATUS_COLORS: Record<SparkEndpoint['status'], string> = {
	green: 'success',
	yellow: 'warning',
	red: 'error'
};

export default function Spark() {
	const { t } = useTranslation();
	const { data, isLoading, isError } = useSparkStatus();

	if (isError) return <Navigate to="/maintenance" />;

	const columns = [
		{
			title: t('spark.backend'),
			dataIndex: 'name',
			key: 'name'
		},
		{
			title: t('spark.height'),
			dataIndex: 'height',
			key: 'height',
			render: (height: number) => height.toLocaleString()
		},
		{
			title: t('spark.lag'),
			dataIndex: 'lag',
			key: 'lag'
		},
		{
			title: t('spark.latency'),
			dataIndex: 'latency_ms',
			key: 'latency_ms',
			render: (ms: number) => `${ms}ms`
		},
		{
			title: t('spark.anonSet'),
			dataIndex: 'anonset',
			key: 'anonset',
			render: (anonset: SparkEndpoint['anonset']) =>
				anonset ? `${anonset.mb.toFixed(1)} MB · ${(anonset.ms / 1000).toFixed(1)}s` : '—'
		},
		{
			title: t('spark.setHash'),
			dataIndex: 'anonset',
			key: 'setHash',
			render: (anonset: SparkEndpoint['anonset']) =>
				anonset ? (
					<Tag color={anonset.consistent ? 'success' : 'error'}>
						{anonset.consistent ? t('spark.match') : t('spark.mismatch')}
					</Tag>
				) : (
					'—'
				)
		},
		{
			title: t('spark.status'),
			dataIndex: 'status',
			key: 'status',
			render: (status: SparkEndpoint['status']) => (
				<Tag color={STATUS_COLORS[status]}>{status.toUpperCase()}</Tag>
			)
		}
	];

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
			<Title level={3} style={{ color: '#ba2a45' }}>
				{t('spark.sparkFleetHealth')}
			</Title>
			<title>{t('spark.firoblockWithSpark')}</title>

			{data?.anonset_source === 'snapshot' && (
				<Alert
					type="info"
					showIcon
					message={t('spark.anonsetSnapshotNotice')}
					description={
						<>
							{t('spark.lastSweptAt')}{' '}
							{new Date(data.anonset_checked_at).toLocaleString(undefined, {
								dateStyle: 'medium',
								timeStyle: 'short'
							})}{' '}
							(
							<TimeAgo
								timestamp={new Date(data.anonset_checked_at).getTime() / 1000}
							/>
							)
						</>
					}
				/>
			)}

			<Card title={t('spark.fleetSummary')}>
				{isLoading ? (
					<Skeleton active />
				) : (
					<Space size={48} wrap>
						<Statistic
							title={t('spark.green')}
							value={data?.summary.green}
							valueStyle={{ color: '#52c41a' }}
						/>
						<Statistic
							title={t('spark.yellow')}
							value={data?.summary.yellow}
							valueStyle={{ color: '#faad14' }}
						/>
						<Statistic
							title={t('spark.red')}
							value={data?.summary.red}
							valueStyle={{ color: '#ff4d4f' }}
						/>
						<Statistic
							title={t('spark.medianLatency')}
							value={data?.stats.median_latency}
							suffix="ms"
						/>
						<Statistic title={t('spark.maxLag')} value={data?.stats.max_lag} />
					</Space>
				)}
			</Card>

			<Card title={t('spark.sparkFleetHealth')}>
				{isLoading ? (
					<Skeleton active />
				) : (
					<div style={{ overflowX: 'auto' }}>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<tbody>
								<tr>
									<td style={{ padding: '8px 16px 8px 0', width: 180 }}>
										<Text type="secondary">{t('spark.sparkConsensus')}</Text>
									</td>
									<td style={{ padding: '8px 0', fontFamily: 'monospace' }}>
										<Text>{data?.spark_consensus}</Text>
									</td>
								</tr>
								<tr>
									<td style={{ padding: '8px 16px 8px 0', width: 180 }}>
										<Text type="secondary">{t('spark.setHashConsensus')}</Text>
									</td>
									<td
										style={{
											padding: '8px 0',
											fontFamily: 'monospace',
											wordBreak: 'break-all'
										}}
									>
										<Text>{data?.spark_sethash_consensus}</Text>
									</td>
								</tr>
								<tr>
									<td style={{ padding: '8px 16px 8px 0', width: 180 }}>
										<Text type="secondary">{t('spark.lastChecked')}</Text>
									</td>
									<td style={{ padding: '8px 0' }}>
										{data && (
											<TimeAgo
												timestamp={
													new Date(data.checked_at).getTime() / 1000
												}
											/>
										)}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				)}
			</Card>

			<Card title={t('spark.backends')}>
				<Table<SparkEndpoint>
					dataSource={data?.endpoints}
					columns={columns}
					loading={isLoading}
					pagination={false}
					size="small"
					scroll={{ x: true }}
					rowKey={(row) => row.id}
				/>
			</Card>

			<Text type="secondary" style={{ fontSize: 12 }}>
				{t('spark.dataFrom')}{' '}
				<Link
					href="https://firo-spark-sync-monitor.vercel.app"
					target="_blank"
					rel="noreferrer"
					style={{ fontSize: 12 }}
				>
					Firo Spark Sync Monitor
				</Link>{' '}
				{t('spark.by')} panagot.
			</Text>
		</div>
	);
}
