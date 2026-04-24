import { Typography, Row, Col } from 'antd';
import { MapContainer, GeoJSON } from 'react-leaflet';
import type { Layer, PathOptions } from 'leaflet';
import type { Feature, FeatureCollection } from 'geojson';
import { useTranslation } from 'react-i18next';
import { feature } from 'topojson-client';
import countries110m from 'world-atlas/countries-110m.json';
import countries from 'i18n-iso-countries';
import { useMasternodeStats } from '@/hooks/useStats';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '@/hooks/useTheme';

const worldGeo = feature(
	// eslint-disable-next-line
	countries110m as any,
	// eslint-disable-next-line
	(countries110m as any).objects.countries
) as unknown as FeatureCollection;

export default function Network() {
	const { t } = useTranslation();
	const { data: stats, isLoading } = useMasternodeStats();
	const { mode } = useTheme();
	const styleBg = mode === 'dark' ? '#2a2a2a' : '#ffffff';
	const styleFeat = mode === 'dark' ? '#ffffff' : '#2a2a2a';

	const countryCountMap = new Map(stats?.countries.map((c) => [c.countryCode, c.count]) ?? []);
	const maxCount = Math.max(1, ...(stats?.countries.map((c) => c.count) ?? [0]));

	const getColor = (count: number): string => {
		if (count === 0) return styleBg;
		const intensity = Math.min(1, count / maxCount);
		const alpha = 0.2 + intensity * 0.8;
		return `rgba(186, 42, 69, ${alpha})`;
	};

	const styleFeature = (feature?: Feature): PathOptions => {
		const numericId = feature?.id?.toString().padStart(3, '0') ?? '';
		const code = countries.numericToAlpha2(numericId) ?? '';
		const count = countryCountMap.get(code) ?? 0;
		return {
			fillColor: getColor(count),
			weight: 0.5,
			color: styleFeat,
			fillOpacity: 1
		};
	};

	const onEachFeature = (feature: Feature, layer: Layer) => {
		const numericId = feature.id?.toString().padStart(3, '0') ?? '';
		const code = countries.numericToAlpha2(numericId) ?? '';
		const count = countryCountMap.get(code) ?? 0;

		layer.bindTooltip(`${code}: ${count}`, { sticky: true });
	};

	return (
		<>
			<Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
				<Col xs={0} lg={24}>
					<Typography.Paragraph style={{ color: '#ba2a45' }}>
						{isLoading
							? t('labels.loading')
							: t('labels.masternodeStatsSummary', {
									total: stats?.total ?? 0
								})}
					</Typography.Paragraph>

					<div
						style={{
							height: 500,
							background: styleBg,
							borderRadius: 8,
							overflow: 'hidden'
						}}
					>
						<MapContainer
							center={[30, 10]}
							zoom={1.5}
							style={{ height: '100%', width: '100%', background: 'transparent' }}
							worldCopyJump
							scrollWheelZoom={false}
						>
							<GeoJSON
								data={worldGeo}
								style={styleFeature}
								onEachFeature={onEachFeature}
								key={stats?.total ?? 0}
							/>
						</MapContainer>
					</div>
				</Col>
			</Row>
		</>
	);
}
