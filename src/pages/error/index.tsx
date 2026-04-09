import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

export default function Error404() {
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
				alt={t('titles.firoblock')}
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
				404
			</Title>
			<title>{t('titles.firoblockNotFound')}</title>

			<Text style={{ fontSize: 18, color: '#d1d5db', maxWidth: 300, display: 'block' }}>
				{t('messages.pageNotFound')}
			</Text>
			<Link
				to="/"
				className="block-nav"
				style={{ color: '#ba2a45', fontSize: 16, maxWidth: 300, display: 'block' }}
			>
				<ArrowLeftOutlined className="arrow-left" />
				{t('links.backToHome')}
			</Link>
		</div>
	);
}
