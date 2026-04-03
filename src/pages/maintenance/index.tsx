import { ArrowLeftOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

interface MaintenanceProps {
	planned: boolean;
}

export default function Maintenance({ planned }: MaintenanceProps) {
	const { t } = useTranslation();
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '60vh',
				textAlign: 'center',
				gap: 24
			}}
		>
			<img
				src="/images/banner-light.svg"
				alt="FiroBlocks"
				style={{ width: 300, height: 'auto' }}
			/>
			<Title
				style={{
					fontSize: '5rem',
					color: '#9b1c2e',
					lineHeight: 1,
					margin: 0,
					maxWidth: 300,
					display: 'block'
				}}
			>
				{planned ? '🔧' : '503'}
			</Title>
			<title>{t('maintenance.pageTitle')}</title>

			<Text style={{ fontSize: 18, color: '#d1d5db', maxWidth: 300, display: 'block' }}>
				{planned ? t('maintenance.plannedMessage') : t('maintenance.unplannedMessage')}
			</Text>

			{!planned && (
				<Link
					to="/"
					className="block-nav"
					style={{ color: '#ba2a45', fontSize: 16, maxWidth: 300, display: 'block' }}
				>
					<ArrowLeftOutlined className="arrow-left" />
					{t('common.backToHome')}
				</Link>
			)}
		</div>
	);
}
