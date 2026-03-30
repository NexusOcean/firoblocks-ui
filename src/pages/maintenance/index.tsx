import { ArrowLeftOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

interface MaintenanceProps {
	planned?: boolean;
}

export default function Maintenance({ planned = false }: MaintenanceProps) {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '100vh',
				textAlign: 'center',
				gap: 24,
				background: '#141414'
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
			<title>FiroBlocks — Maintenance</title>

			<Text style={{ fontSize: 18, color: '#d1d5db', maxWidth: 300, display: 'block' }}>
				{planned
					? "We're down for scheduled maintenance. We'll be back shortly."
					: "We're currently looking into it. Please check back soon."}
			</Text>

			<Link
				to="/"
				className="block-nav"
				style={{ color: '#ba2a45', fontSize: 16, maxWidth: 300, display: 'block' }}
			>
				<ArrowLeftOutlined className="arrow-left" />
				Back to Home
			</Link>
		</div>
	);
}
