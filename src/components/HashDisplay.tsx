import { useState } from 'react';
import { Tooltip, Typography } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface HashDisplayProps {
	value: string;
	truncate?: boolean;
}

const truncateHash = (hash: string) => `${hash.slice(0, 8)}…${hash.slice(-8)}`;

export default function HashDisplay({ value, truncate = true }: HashDisplayProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(value);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<span
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: 6,
				fontFamily: 'monospace'
			}}
		>
			<Text style={{ color: '#ba2a45', letterSpacing: '0.01em' }}>
				{truncate ? truncateHash(value) : value}
			</Text>
			<Tooltip title={copied ? 'Copied!' : 'Copy'}>
				<span
					onClick={handleCopy}
					style={{ cursor: 'pointer', color: copied ? '#52c41a' : '#7c1624' }}
				>
					{copied ? (
						<CheckOutlined style={{ fontSize: 13 }} />
					) : (
						<CopyOutlined style={{ fontSize: 13 }} />
					)}
				</span>
			</Tooltip>
		</span>
	);
}
