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
		key: 'firo',
		label: 'Firo',
		coin: 'FIRO',
		network: 'Transparent or Spark',
		address:
			'sm1nthexc43lx3803l8kp5wym9ctzc2huutfq2v8snnv22rjarvyqn8h96zkhynd3y753yzs34glgg84q2kwamvu2vp99egf9mywwc4mdej6za309rg470fzwydeuyqqalh6dg0usqf66vq3'
	},
	{
		key: 'btc',
		label: 'Bitcoin',
		coin: 'BTC',
		network: 'Mainnet',
		address: 'bc1pfy0ru0gwz3uwmqkrmsgztpd97xq69g0e3yqksjj5g93zsgx8afjqmkq9wf'
	},
	{
		key: 'ltc',
		label: 'Litecoin',
		coin: 'LTC',
		network: 'Mainnet or MWEB',
		address:
			'ltcmweb1qqdsz0s4ej33c45j0ktvmf7wyk7yrf2lv80jwxg8thaq8qtf8ajy2wqc0tnf6qww5zgarucavu6x56y6mcwzvv5km635paczp7xyzfe4a3qaahtre'
	},
	{
		key: 'eth',
		label: 'Ethereum',
		coin: 'ETH',
		network: 'Mainnet',
		address: '0x6eFaF25038eE9b54672513afD900586f290b94eB'
	},
	{
		key: 'xmr',
		label: 'Monero',
		coin: 'XMR',
		network: 'Mainnet',
		address:
			'42JJ87GZ7ygWMfTR9bEygySbXXG25TpBSLcT1FBn9y97NKTAAbXyrtVACyKRAoy78hYux4C7ZB3qP1eu9ee1E5Wm7KvwVnS'
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
					{opt.coin === 'ETH'
						? 'ETH or ERC20 tokens to this address.'
						: opt.coin + ' to this address.'}
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
