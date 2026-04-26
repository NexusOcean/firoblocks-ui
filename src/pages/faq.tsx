import { useState } from 'react';
import { Collapse, Typography, Space, Input, Tag } from 'antd';
import {
	QuestionCircleOutlined,
	SearchOutlined,
	SwapOutlined,
	LockOutlined,
	WalletOutlined,
	WarningOutlined,
	InfoCircleOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Text, Title } = Typography;

const FAQ_ITEMS = [
	{
		category: 'Swaps',
		icon: <SwapOutlined />,
		color: '#1677ff',
		questions: [
			{
				q: 'How does a swap work?',
				a: 'FiroBlocks acts as a non-custodial exchange. You provide the coins you want to send, select what you want to receive, and we generate a deposit address. Once your coins are confirmed on-chain, we automatically send you the swapped amount to your receive address.'
			},
			{
				q: 'How long does a swap take?',
				a: 'Swap times depend on the blockchains involved. Typically swaps complete within 15-30 minutes, but some networks may take longer depending on congestion and the number of required confirmations. If no confirmations are received within 30 minutes, your swap will be recalculated at current market rates.'
			},
			{
				q: 'What happens if my swap fails?',
				a: 'If a swap cannot be completed, your funds will be returned to the refund address you provided. Note that if market rates have changed significantly by the time a failure occurs, the swap may be recalculated at current rates before a refund is issued. Network fees are deducted from refunds.'
			},
			{
				q: 'What if I send too little?',
				a: 'Your order will be partially filled for as much as you have deposited. Make sure to send the full quoted amount to receive the expected output.'
			},
			{
				q: 'What if I accidentally send too much?',
				a: 'The swap will be adjusted for the full amount sent if liquidity is available. If there is insufficient liquidity, the swap will fail and a refund will be issued minus network fees.'
			},
			{
				q: 'What if my deposit confirmation takes too long?',
				a: 'If no confirmations are received within 30 minutes, your swap will be recalculated at current market rates. If too much time passes without any network confirmations, the swap will fail and you will need to contact support for a refund.'
			},
			{
				q: 'What if I send funds after the offer expires?',
				a: 'Your swap will be recalculated at current market rates. If too much time has passed the swap will fail.'
			},
			{
				q: 'Is there a minimum or maximum swap amount?',
				a: 'Yes, each trading pair has minimum and maximum limits which are displayed when you fetch a rate. These limits exist to ensure liquidity and cover network fees.'
			}
		]
	},
	{
		category: 'Privacy',
		icon: <LockOutlined />,
		color: '#9B1C2E',
		questions: [
			{
				q: 'Do you collect my personal data?',
				a: 'FiroBlocks does not require KYC or personal identification. We only store the minimum data necessary to process your swap. Please refer to our Privacy Policy for full details.'
			},
			{
				q: 'Is FiroBlocks non-custodial?',
				a: 'Yes. We never hold your funds beyond what is strictly necessary to execute a swap. You always remain in control of your refund and receive addresses.'
			},
			{
				q: 'Do you use third-party infrastructure?',
				a: 'Yes. Swap execution is powered by a third-party exchange provider. We do not share any personal information with them — only the technical details required to process your swap, such as addresses and amounts.'
			},
			{
				q: 'Do you use cookies?',
				a: 'We use a single strictly necessary cookie to track your active swap session. It stores your swap ID and creation time so you can recover your swap if you refresh the page. No personal data is stored and the cookie expires automatically. No cookie consent is required as this is a functional cookie.'
			}
		]
	},
	{
		category: 'Wallets',
		icon: <WalletOutlined />,
		color: '#52c41a',
		questions: [
			{
				q: 'What wallets are supported?',
				a: "FiroBlocks works with any self-custodial wallet that supports the coins you're swapping. Do not send from a centralized exchange (CEX) such as Coinbase, Binance, or Kraken — we can only accept transactions from self-custodial wallets. Do not use exchange deposit addresses as your receive or refund address, as they may not be permanent."
			},
			{
				q: 'Are private transactions supported?',
				a: 'Currently only transparent (on-chain) transactions are supported. For Firo, do not send from Spark or Lelantus addresses. For Litecoin, do not send from MWEB addresses. Use a standard transparent address when initiating a swap.'
			},
			{
				q: 'What is a refund address?',
				a: "A refund address is a wallet address you own for the coin you're sending. If the swap cannot be completed, your funds will be returned to this address. Always double-check it before submitting."
			}
		]
	},
	{
		category: 'Issues',
		icon: <WarningOutlined />,
		color: '#fa8c16',
		questions: [
			{
				q: 'I sent coins but nothing happened. What do I do?',
				a: "First, verify your transaction has the required number of confirmations on the blockchain explorer. If it's confirmed and nothing has happened after 60 minutes, please contact support with your swap ID and transaction hash."
			},
			{
				q: 'I entered the wrong receive address. Can it be changed?',
				a: 'Unfortunately, once a deposit is received we cannot change the destination address. Please always double-check your receive address before sending any funds.'
			}
		]
	},
	{
		category: 'About',
		icon: <InfoCircleOutlined />,
		color: '#722ed1',
		questions: [
			{
				q: 'What is FiroBlocks?',
				a: 'FiroBlocks is a privacy-focused, non-custodial crypto swap service. Our goal is to make private exchanges accessible to everyone without requiring accounts or personal information.'
			},
			{
				q: 'How do I contact support?',
				a: 'You can reach us via Email or through SimpleX Chat, both linked below. We aim to respond within 24 hours.'
			}
		]
	}
];

export default function FAQ() {
	const [search, setSearch] = useState('');
	const { t } = useTranslation();

	const filtered = FAQ_ITEMS.map((cat) => ({
		...cat,
		questions: cat.questions.filter(
			({ q, a }) =>
				q.toLowerCase().includes(search.toLowerCase()) ||
				a.toLowerCase().includes(search.toLowerCase())
		)
	})).filter((cat) => cat.questions.length > 0);

	return (
		<div className="faq-page">
			<title>{t('titles.faq')}</title>

			<Title level={3} style={{ color: '#ba2a45' }}>
				{t('titles.faq')}
			</Title>
			<Text className="faq-subtitle">{t('titles.faqSubtitles')}</Text>

			<Space wrap className="faq-tags">
				{FAQ_ITEMS.map((cat) => (
					<Tag
						key={cat.category}
						icon={cat.icon}
						style={{ background: cat.color, color: '#fff', fontWeight: 'bold' }}
						className="faq-tag"
					>
						{cat.category}
					</Tag>
				))}
			</Space>

			<Input
				prefix={<SearchOutlined className="faq-search-icon" />}
				placeholder="Search questions..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				size="large"
				allowClear
				className="faq-search"
			/>

			<div className="faq-list">
				{filtered.length === 0 ? (
					<div className="faq-empty">
						<QuestionCircleOutlined className="faq-empty-icon" />
						<Text type="secondary">No results found for "{search}"</Text>
					</div>
				) : (
					filtered.map((cat, ci) => (
						<div key={ci} className="faq-category">
							<Space className="faq-category-header">
								<span style={{ color: cat.color, fontSize: 16 }}>{cat.icon}</span>
								<Text
									strong
									className="faq-category-label"
									style={{ color: cat.color }}
								>
									{cat.category}
								</Text>
							</Space>
							<Collapse
								accordion
								bordered={false}
								className="faq-collapse"
								items={cat.questions.map((item, qi) => ({
									key: `${ci}-${qi}`,
									label: (
										<Text strong className="faq-question">
											{item.q}
										</Text>
									),
									children: <Text className="faq-answer">{item.a}</Text>,
									style: {
										borderBottom:
											qi < cat.questions.length - 1
												? '1px solid var(--ant-color-border-secondary)'
												: 'none'
									}
								}))}
							/>
						</div>
					))
				)}
			</div>

			<div className="faq-cta">
				<Text strong className="faq-cta-title">
					Still have questions?
				</Text>
				<Text className="faq-cta-subtitle">
					Our team is happy to help — reach out anytime.
				</Text>
				<Space className="faq-cta-links">
					<a href="mailto:hello@firoblocks.app" className="faq-cta-link">
						Email 📧
					</a>
					<Text type="secondary">·</Text>
					<a
						href="https://smp2.simplexonflux.com/a#e4BKKMD9I-8Qv3_Ky1xyiTzg9vzeYTXRCDbZZjbs0DM"
						target="_blank"
						rel="noreferrer"
						className="faq-cta-link"
					>
						SimpleX 💬
					</a>
				</Space>
			</div>
		</div>
	);
}
