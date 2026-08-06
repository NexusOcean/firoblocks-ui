import { useState } from 'react';
import { Button, Modal, Tabs, QRCode, Typography, Space, Tooltip, message } from 'antd';
import { CopyOutlined, HeartOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

type DonationOption = {
	key: string;
	label: string;
	coin: string;
	network: string;
	address: string;
};

const DONATION_OPTIONS: DonationOption[] = [
	{
		key: 'spark',
		label: 'Firo',
		coin: 'Spark',
		network: 'Spark',
		address:
			'sm1c5nlzjpzhqnljxhdu75qfw7876ez0g4uqr0hmklz2z2gsmlx65xckn762mlj4sumkejgsuyh93532qdhvy7lsex523hea30gl0zlnc3nt2qhhhand9hyc6u4dk5f7fn8p6w8hzs2sre39'
	},
	{
		key: 'mainnet',
		label: 'Firo',
		coin: 'Transparent',
		network: 'Mainnet',
		address: 'a7ispoSZNH72k1aLhtDWfUd18HRMTBidCx'
	}
];

export default function DonateModal() {
	const [open, setOpen] = useState(false);
	const [messageApi, contextHolder] = message.useMessage();

	const handleCopy = async (address: string) => {
		try {
			await navigator.clipboard.writeText(address);
			messageApi.success('Address copied to clipboard');
		} catch {
			messageApi.error('Failed to copy address');
		}
	};

	const tabItems = DONATION_OPTIONS.map((opt) => ({
		key: opt.key,
		label: <span>{opt.coin}</span>,
		children: (
			<Space
				orientation="vertical"
				align="center"
				style={{ width: '100%', padding: '8px 0' }}
			>
				<QRCode value={opt.address} size={220} type="svg" />
				<Text strong>
					{opt.label} ({opt.coin})
				</Text>
				<Text type="secondary">Network: {opt.network}</Text>
				<Space.Compact style={{ width: '100%', maxWidth: 300 }}>
					<Paragraph
						copyable={false}
						style={{
							flex: 1,
							margin: 0,
							padding: '6px 10px',
							background: 'rgba(0,0,0,0.03)',
							borderRadius: 6,
							fontFamily: 'monospace',
							fontSize: 12,
							wordBreak: 'break-all',
							textAlign: 'center'
						}}
					>
						{opt.address}
					</Paragraph>
				</Space.Compact>
				<Tooltip title="Copy address">
					<Button icon={<CopyOutlined />} onClick={() => handleCopy(opt.address)}>
						Copy address
					</Button>
				</Tooltip>
				<Text type="warning" style={{ fontSize: 12, textAlign: 'center', maxWidth: 300 }}>
					{'Send only '}
					{opt.coin + ' to this address.'}
				</Text>
			</Space>
		)
	}));

	return (
		<>
			{contextHolder}
			<Button type="primary" icon={<HeartOutlined />} onClick={() => setOpen(true)}>
				Donate
			</Button>
			<Modal
				title="Support the project"
				open={open}
				onCancel={() => setOpen(false)}
				footer={null}
				destroyOnHidden
				width={480}
			>
				<Tabs defaultActiveKey={DONATION_OPTIONS[0].key} items={tabItems} centered />
			</Modal>
		</>
	);
}
