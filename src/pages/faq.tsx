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

type FaqItem = { q: string; a: string };

const FAQ_CATEGORIES = [
	{ key: 'swaps', icon: <SwapOutlined />, color: '#1677ff' },
	{ key: 'privacy', icon: <LockOutlined />, color: '#9B1C2E' },
	{ key: 'wallets', icon: <WalletOutlined />, color: '#52c41a' },
	{ key: 'issues', icon: <WarningOutlined />, color: '#fa8c16' },
	{ key: 'about', icon: <InfoCircleOutlined />, color: '#722ed1' }
] as const;

export default function FAQ() {
	const [search, setSearch] = useState('');
	const { t } = useTranslation();

	const categories = FAQ_CATEGORIES.map((cat) => ({
		...cat,
		label: t(`faq.categories.${cat.key}`),
		questions: t(`faq.items.${cat.key}`, { returnObjects: true }) as FaqItem[]
	}));

	const filtered = categories
		.map((cat) => ({
			...cat,
			questions: cat.questions.filter(
				({ q, a }) =>
					q.toLowerCase().includes(search.toLowerCase()) ||
					a.toLowerCase().includes(search.toLowerCase())
			)
		}))
		.filter((cat) => cat.questions.length > 0);

	return (
		<div className="faq-page">
			<title>{`${t('titles.firoblock')} — ${t('titles.faq')}`}</title>

			<Title level={3} style={{ color: '#ba2a45' }}>
				{t('titles.faq')}
			</Title>
			<Text className="faq-subtitle">{t('titles.faqSubtitles')}</Text>

			<Space wrap className="faq-tags">
				{categories.map((cat) => (
					<Tag
						key={cat.key}
						icon={cat.icon}
						style={{ background: cat.color, color: '#fff', fontWeight: 'bold' }}
						className="faq-tag"
					>
						{cat.label}
					</Tag>
				))}
			</Space>

			<Input
				prefix={<SearchOutlined className="faq-search-icon" />}
				placeholder={t('faq.searchPlaceholder')}
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
						<Text type="secondary">{t('faq.noResults', { search })}</Text>
					</div>
				) : (
					filtered.map((cat, ci) => (
						<div key={cat.key} className="faq-category">
							<Space className="faq-category-header">
								<span style={{ color: cat.color, fontSize: 16 }}>{cat.icon}</span>
								<Text
									strong
									className="faq-category-label"
									style={{ color: cat.color }}
								>
									{cat.label}
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
					{t('faq.stillHaveQuestions')}
				</Text>
				<Text className="faq-cta-subtitle">{t('faq.ctaSubtitle')}</Text>
				<Space className="faq-cta-links">
					<a href="mailto:hello@firoblocks.app" className="faq-cta-link">
						{t('faq.emailLink')}
					</a>
					<Text type="secondary">·</Text>
					<a
						href="https://smp2.simplexonflux.com/a#e4BKKMD9I-8Qv3_Ky1xyiTzg9vzeYTXRCDbZZjbs0DM"
						target="_blank"
						rel="noreferrer"
						className="faq-cta-link"
					>
						{t('faq.simplexLink')}
					</a>
				</Space>
			</div>
		</div>
	);
}
