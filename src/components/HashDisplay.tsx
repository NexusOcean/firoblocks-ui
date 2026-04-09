import { useState } from 'react';
import { Tooltip, Typography } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

interface HashDisplayProps {
	value: string;
	truncate?: boolean;
	copy?: boolean;
}

export const truncateHash = (hash: string) => {
	if (!hash) return '';
	return `${hash.slice(0, 8)}…${hash.slice(-8)}`;
};

export default function HashDisplay({ value, truncate = true, copy = true }: HashDisplayProps) {
	const [copied, setCopied] = useState(false);
	const { t } = useTranslation();

	const handleCopy = async () => {
		const text = value.replaceAll(',', '');
		await navigator.clipboard.writeText(text);
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
			{copy && (
				<Tooltip title={copied ? t('labels.copied') : t('labels.copy')}>
					<span
						onClick={handleCopy}
						style={{ cursor: 'pointer', color: copied ? '#52c41a' : '' }}
					>
						{copied ? (
							<CheckOutlined style={{ fontSize: 16, padding: 2 }} />
						) : (
							<CopyOutlined style={{ fontSize: 16, padding: 2 }} />
						)}
					</span>
				</Tooltip>
			)}
		</span>
	);
}
