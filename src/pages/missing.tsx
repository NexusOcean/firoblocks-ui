import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function Missing() {
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
				404
			</Title>
			<title>FiroBlocks — Not Found</title>

			<Text style={{ fontSize: 18, color: '#d1d5db', maxWidth: 300, display: 'block' }}>
				The page you requested could not be found.
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
