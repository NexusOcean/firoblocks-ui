import { Typography, Row, Col, Table, Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMasternodeStats } from '@/hooks/useStats';
import type { MasternodeCountryDto, MasternodeAsnDto } from '@/types/dto';

const { Title, Text } = Typography;

export default function NetworkTables() {
	const { t } = useTranslation();
	const { data: stats, isLoading } = useMasternodeStats();

	const countryColumns = [
		{
			title: t('labels.country'),
			dataIndex: 'country',
			key: 'country',
			render: (v: string) => v || t('labels.unknown')
		},
		{
			title: t('labels.code'),
			dataIndex: 'countryCode',
			key: 'countryCode',
			render: (v: string) => v || t('labels.unknown')
		},
		{
			title: t('labels.masternodes'),
			dataIndex: 'count',
			key: 'count',
			render: (v: number) => <span style={{ color: '#ba2a45' }}>{v.toLocaleString()}</span>
		}
	];

	const asnColumns = [
		{
			title: t('labels.asn'),
			dataIndex: 'asn',
			key: 'asn',
			render: (v: number) => v || t('labels.unknown')
		},
		{
			title: t('labels.provider'),
			dataIndex: 'org',
			key: 'org',
			render: (v: string) => v || t('labels.unknown')
		},
		{
			title: t('labels.masternodes'),
			dataIndex: 'count',
			key: 'count',
			render: (v: number) => <span style={{ color: '#ba2a45' }}>{v.toLocaleString()}</span>
		}
	];

	return (
		<>
			<Row gutter={[24, 24]}>
				<Col>
					<Title level={3} style={{ color: '#ba2a45' }}>
						{t('labels.stats')}
					</Title>
				</Col>
			</Row>
			<Row gutter={[24, 24]}>
				<Col xs={24} xl={12}>
					<Text style={{ fontSize: 24, fontWeight: 600 }}>{t('titles.byCountry')}</Text>
					<Divider style={{ margin: '8px 0' }} />
					<Table<MasternodeCountryDto>
						dataSource={stats?.countries}
						columns={countryColumns}
						loading={isLoading}
						size="small"
						scroll={{ x: true }}
						rowKey="countryCode"
						pagination={{ pageSize: 15, showSizeChanger: false, size: 'medium' }}
					/>
				</Col>
				<Col xs={24} xl={12}>
					<Text style={{ fontSize: 24, fontWeight: 600 }}>{t('titles.byProvider')}</Text>
					<Divider style={{ margin: '8px 0' }} />
					<Table<MasternodeAsnDto>
						dataSource={stats?.asns}
						columns={asnColumns}
						loading={isLoading}
						size="small"
						scroll={{ x: true }}
						rowKey="asn"
						pagination={{ pageSize: 15, showSizeChanger: false, size: 'medium' }}
					/>
				</Col>
			</Row>
		</>
	);
}
