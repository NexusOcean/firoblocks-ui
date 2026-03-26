import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function Error404() {
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
				style={{ width: 220, height: 'auto' }}
			/>
			<Title style={{ fontSize: '6rem', color: '#9b1c2e', lineHeight: 1, margin: 0 }}>
				404
			</Title>
			<title>FiroBlocks — Not Found</title>

			<Text type="secondary" style={{ fontSize: 18 }}>
				The page you requested could not be found.
			</Text>
			<Link to="/" style={{ color: '#ba2a45', fontSize: 16 }}>
				<ArrowLeftOutlined /> Back to Home
			</Link>
		</div>
	);
}
