import { useEffect, useState } from 'react';
import { Button, Input, Select, Typography, Space, Divider, Alert, message, Row, Col } from 'antd';
import { SwapOutlined, ArrowRightOutlined, CopyOutlined, LoadingOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { getEstimate, createExchange, getExchange, getPrice } from '@/services/api';
import { COIN_VALIDATION, type AllowedCoin, type Exchange, type ExchangeStatus } from '@/types';
import Cookies from 'js-cookie';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

const { Text, Title } = Typography;

const isProd = import.meta.env.VITE_LOCAL_API === 'false';

const cookieOpts = {
	path: '/',
	...(isProd && { domain: '.firoblocks.app' })
};

const COINS: { value: AllowedCoin; label: string; color: string }[] = [
	{ value: 'btc', label: 'BTC', color: '#f7931a' },
	{ value: 'eth', label: 'ETH', color: '#627eea' },
	{ value: 'firo', label: 'FIRO', color: '#9B1C2E' },
	{ value: 'xmr', label: 'XMR', color: '#ff6600' },
	{ value: 'ltc', label: 'LTC', color: '#bfbbbb' }
];

const CoinOption = ({ label, color }: { label: string; color: string }) => (
	<Space size={8}>
		<span className="coin-dot" style={{ background: color }} />
		<span className="coin-label">{label}</span>
	</Space>
);

function validateAddress(coin: AllowedCoin, address: string): boolean {
	try {
		return new RegExp(COIN_VALIDATION[coin]).test(address);
	} catch {
		return true;
	}
}
const TERMINAL_STATUSES: ExchangeStatus[] = ['finished', 'failed', 'refunded'];

const trimZeros = (s: string | number) => {
	const str = String(s);
	return str.includes('.') ? str.replace(/0+$/, '').replace(/\.$/, '') : str;
};

export default function Swap() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [sendAmount, setSendAmount] = useState('');
	const [receiveAmount, setReceiveAmount] = useState('');
	const [sendCoin, setSendCoin] = useState<AllowedCoin | null>('btc');
	const [receiveCoin, setReceiveCoin] = useState<AllowedCoin>('firo');
	const [refundAddr, setRefundAddr] = useState('');
	const [receiveAddr, setReceiveAddr] = useState('');
	const [rateInfo, setRateInfo] = useState<{ rate: string; estimated: string } | null>(null);
	const [exchange, setExchange] = useState<Exchange | null>(null);
	const [opaqueId, setOpaqueId] = useState<string | null>(null);
	const [estimating, setEstimating] = useState(false);
	const [swapping, setSwapping] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [timeLeft, setTimeLeft] = useState(0);
	const { t } = useTranslation();

	useEffect(() => {
		const urlSwapId = searchParams.get('swapId');
		const cookieSwapId = Cookies.get('swapId') ?? null;
		const swapId = urlSwapId ?? cookieSwapId;

		if (swapId) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setOpaqueId(swapId);
			if (!urlSwapId && cookieSwapId) {
				setSearchParams({ swapId: cookieSwapId }, { replace: true });
			}
		}

		const timeExpiry = Cookies.get('timeExpiry');
		if (timeExpiry) {
			const remaining = Math.max(0, Math.floor((Number(timeExpiry) - Date.now()) / 1000));
			setTimeLeft(remaining);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!opaqueId || timeLeft <= 0) return;

		const timeExpiry = Cookies.get('timeExpiry');
		if (!timeExpiry) return;
		const expiry = Number(timeExpiry);

		const interval = setInterval(() => {
			const remaining = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
			setTimeLeft(remaining);
			if (remaining <= 0) clearInterval(interval);
		}, 1000);

		return () => clearInterval(interval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [opaqueId]);

	const expiration =
		timeLeft > 0
			? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`
			: null;

	const { data: swap } = useQuery({
		queryKey: ['swap', opaqueId],
		queryFn: () => getExchange(opaqueId!),
		enabled: opaqueId !== null,
		retry: 0,
		refetchInterval: (query) =>
			query.state.data && TERMINAL_STATUSES.includes(query.state.data.status) ? false : 30_000
	});

	const confirmSwap = async () => {
		if (!sendCoin) return;
		await handleSwap();
	};

	const coinOptions = COINS.map((c) => ({
		value: c.value,
		label: <CoinOption {...c} />
	}));

	const handleGetRate = async () => {
		if (!sendCoin || !receiveCoin || !sendAmount) return;
		setEstimating(true);
		setError(null);
		setRateInfo(null);
		try {
			const res = await getEstimate({
				currency_from: sendCoin,
				currency_to: receiveCoin,
				amount_from: sendAmount
			});
			setReceiveAmount(res.estimated_amount);
			setRateInfo({
				rate: `1 ${sendCoin.toUpperCase()} ≈ ${res.estimated_amount} ${receiveCoin.toUpperCase()}`,
				estimated: res.estimated_amount
			});
		} catch {
			setError(t('swap.errorEstimate'));
		} finally {
			setEstimating(false);
		}
	};

	const handleSwap = async () => {
		if (!rateInfo || !receiveAddr || !sendCoin) return;

		if (!validateAddress(receiveCoin, receiveAddr)) {
			setError(t('swap.errorInvalidReceive', { coin: receiveCoin.toUpperCase() }));
			return;
		}
		if (refundAddr && !validateAddress(sendCoin, refundAddr)) {
			setError(t('swap.errorInvalidRefund', { coin: sendCoin.toUpperCase() }));
			return;
		}

		setSwapping(true);
		setError(null);
		try {
			const res = await createExchange({
				currency_from: sendCoin,
				currency_to: receiveCoin,
				address_to: receiveAddr,
				amount_from: sendAmount,
				...(refundAddr && { refund_address: refundAddr })
			});
			setExchange(res.exchange);
			setOpaqueId(res.opaqueId);
			setSearchParams({ swapId: res.opaqueId }, { replace: true });

			const timeExpiry = Cookies.get('timeExpiry');
			if (timeExpiry) {
				const remaining = Math.max(0, Math.floor((Number(timeExpiry) - Date.now()) / 1000));
				setTimeLeft(remaining);
			}
		} catch {
			setError(t('swap.errorCreateSwap'));
		} finally {
			setSwapping(false);
		}
	};

	const swapCoins = () => {
		setSendCoin(receiveCoin);
		setReceiveCoin(sendCoin ?? 'firo');
		setSendAmount(receiveAmount);
		setReceiveAmount(sendAmount);
		setRateInfo(null);
	};

	const handleReset = () => {
		setSendAmount('');
		setReceiveAmount('');
		setSendCoin(null);
		setReceiveCoin('firo');
		setRefundAddr('');
		setReceiveAddr('');
		setRateInfo(null);
		setExchange(null);
		setOpaqueId(null);
		setTimeLeft(0);
		setError(null);
		Cookies.remove('swapId', cookieOpts);
		Cookies.remove('timeExpiry', cookieOpts);
		setSearchParams({}, { replace: true });
	};

	const displaySendAmount = swap?.amount_from ? trimZeros(swap.amount_from) : sendAmount;
	const displayReceiveAmount = swap?.amount_to ? trimZeros(swap.amount_to) : receiveAmount;
	const displaySendCoin = swap?.currency_from ?? sendCoin;
	const displayReceiveCoin = swap?.currency_to ?? receiveCoin;
	const displayRefundAddr = swap?.refund_address ?? refundAddr;
	const displayReceiveAddr = swap?.address_to ?? receiveAddr;

	const depositData = swap ?? exchange;
	const swapLocked = opaqueId !== null;

	const titleText = swapLocked
		? expiration
			? t('swap.expiresIn', { time: expiration })
			: t('swap.expired')
		: t('swap.getExchangeRate');

	const { data: price } = useQuery({
		queryKey: ['firo-price'],
		queryFn: getPrice,
		refetchInterval: 120_000
	});

	return (
		<div>
			<title>{`${t('titles.firoblock')} — ${t('labels.swap')}`}</title>
			<Row gutter={[24, 24]}>
				<Col>
					<Title level={3} style={{ color: '#ba2a45' }}>
						FIRO ${price?.usd?.toFixed(2) ?? '—'}
					</Title>
					<Divider style={{ margin: '8px 0' }} />
				</Col>
			</Row>

			<Row gutter={[16, 16]} style={{ marginBottom: 24 }} justify="center">
				<Col>
					<div className="swap-page">
						<div className="swap-card" style={{ margin: '8px 0' }}>
							<div className="swap-card-labels">
								<Title
									level={3}
									className="swap-card-title"
									style={{ marginBottom: 24, marginRight: 'auto' }}
								>
									<SwapOutlined className="swap-card-title-icon" />
									{titleText}
								</Title>

								<Title
									level={4}
									className="swap-card-title"
									style={{ marginBottom: 24 }}
								>
									{swap
										? t('swap.status', {
												status: t(`swap.statuses.${swap.status}`, {
													defaultValue: swap.status
												})
											})
										: ''}
								</Title>
							</div>

							<Alert
								title={t('swap.warningTitle')}
								description={t('swap.warningDescription')}
								type="warning"
								showIcon
								style={{ fontSize: 16, marginBottom: 48 }}
								closable={{ closeIcon: true }}
							/>

							<div className="swap-row">
								<div className="swap-field">
									<Text strong className="swap-field-label">
										{t('swap.youSend')}
									</Text>
									<Space.Compact style={{ width: '100%' }}>
										<Input
											placeholder={t('swap.amountPlaceholder')}
											onChange={(e) => {
												const val = e.target.value;
												if (val === '' || /^\d*\.?\d*$/.test(val)) {
													setSendAmount(val);
													setRateInfo(null);
												}
											}}
											size="large"
											type="text"
											inputMode="decimal"
											className="swap-receive-input"
											value={displaySendAmount}
										/>
										<Select
											placeholder={t('swap.sendPlaceholder')}
											options={coinOptions}
											onChange={(v: AllowedCoin) => {
												if (v !== receiveCoin) {
													setSendCoin(v);
													setRateInfo(null);
												}
											}}
											size="large"
											className="swap-coin-select"
											value={displaySendCoin}
										/>
									</Space.Compact>
								</div>

								<div className="swap-icon-col">
									<Button
										shape="circle"
										icon={<SwapOutlined />}
										onClick={swapCoins}
										className="swap-icon-btn"
									/>
								</div>

								<div className="swap-field">
									<Text strong className="swap-field-label">
										{t('swap.youReceive')}
									</Text>
									<Space.Compact style={{ width: '100%' }}>
										<Input
											placeholder={t('swap.amountPlaceholder')}
											readOnly
											size="large"
											className="swap-receive-input"
											value={displayReceiveAmount}
										/>
										<Select
											placeholder={t('swap.receivePlaceholder')}
											options={coinOptions}
											onChange={(v) => {
												if (v !== sendCoin) {
													setReceiveCoin(v);
													setRateInfo(null);
												}
											}}
											size="large"
											className="swap-coin-select"
											value={displayReceiveCoin}
										/>
									</Space.Compact>
								</div>
							</div>

							{rateInfo && (
								<div className="swap-rate-info">
									<Text className="swap-rate-text">
										{t('swap.rateLabel')} <b>{rateInfo.rate}</b>
									</Text>
									<Text className="swap-rate-text">{t('swap.floatingRate')}</Text>
								</div>
							)}

							<Divider className="swap-divider" />

							<div className="swap-row">
								<div className="swap-field">
									<Text strong className="swap-field-label">
										{t('swap.refundAddress')}
									</Text>
									<Input
										className="swap-receive-input"
										placeholder={
											sendCoin
												? t('swap.refundAddressPlaceholder', {
														coin: sendCoin.toUpperCase()
													})
												: t('swap.refundAddressFallback')
										}
										value={displayRefundAddr}
										onChange={(e) => setRefundAddr(e.target.value)}
										size="large"
									/>
									<Text className="swap-field-hint">
										{t('swap.refundAddressHint')}
									</Text>
								</div>
								<div className="swap-field">
									<Text strong className="swap-field-label">
										{t('swap.receiveAddress')}
									</Text>
									<Input
										className="swap-receive-input"
										placeholder={t('swap.receiveAddressPlaceholder', {
											coin: receiveCoin.toUpperCase()
										})}
										value={displayReceiveAddr}
										onChange={(e) => setReceiveAddr(e.target.value)}
										size="large"
									/>
									<Text className="swap-field-hint">
										{t('swap.receiveAddressHint')}
									</Text>
								</div>
							</div>

							{error && (
								<Alert
									title={error}
									type="error"
									showIcon
									closable={{ closeIcon: true }}
									style={{ margin: 48 }}
								/>
							)}

							<div className="swap-actions">
								{expiration === null && swapLocked ? (
									<Button size="large" onClick={handleReset}>
										{t('swap.newSwap')}
									</Button>
								) : (
									<>
										<Button
											size="large"
											onClick={handleGetRate}
											disabled={
												!sendAmount ||
												!sendCoin ||
												!receiveCoin ||
												estimating
											}
											icon={estimating ? <LoadingOutlined /> : undefined}
										>
											{t('swap.getRate')}
										</Button>
										<Button
											type="primary"
											size="large"
											icon={
												swapping ? (
													<LoadingOutlined />
												) : (
													<ArrowRightOutlined />
												)
											}
											onClick={confirmSwap}
											disabled={
												!rateInfo || !receiveAddr || swapping || swapLocked
											}
											className="swap-btn-primary"
										>
											{t('swap.swapButton')}
										</Button>
									</>
								)}
							</div>
						</div>

						{depositData && (
							<div className="swap-card swap-deposit-card">
								<Alert
									title={t('swap.swapCreated')}
									type="success"
									showIcon
									className="swap-deposit-alert"
								/>
								<Text strong className="swap-deposit-label">
									{t('swap.sendCoinsHere')}
								</Text>
								<Space.Compact style={{ width: '100%' }}>
									<Input
										value={depositData.address_from}
										readOnly
										size="large"
										className="swap-deposit-input"
									/>
									<Button
										size="large"
										icon={<CopyOutlined />}
										onClick={() => {
											navigator.clipboard.writeText(depositData.address_from);
											message.success(t('swap.addressCopied'));
										}}
									>
										{t('labels.copy')}
									</Button>
								</Space.Compact>
								{depositData.extra_id_from && (
									<>
										<Text
											strong
											className="swap-deposit-label"
											style={{ marginTop: 12 }}
										>
											{t('swap.memoExtraId')}
										</Text>
										<Space.Compact style={{ width: '100%' }}>
											<Input
												value={depositData.extra_id_from}
												readOnly
												size="large"
												className="swap-deposit-input"
											/>
											<Button
												size="large"
												icon={<CopyOutlined />}
												onClick={() => {
													navigator.clipboard.writeText(
														depositData.extra_id_from
													);
													message.success(t('swap.memoCopied'));
												}}
											>
												{t('labels.copy')}
											</Button>
										</Space.Compact>
									</>
								)}

								<Text className="swap-field-hint">
									{t('swap.sendExactly', {
										amount: displaySendAmount,
										coin: displaySendCoin?.toUpperCase() ?? ''
									})}{' '}
									{expiration
										? t('swap.depositWindow', { time: expiration })
										: t('swap.depositExpired')}
								</Text>

								{opaqueId && (
									<Alert
										type="info"
										showIcon
										style={{ marginTop: 12 }}
										title={t('swap.saveSwapId')}
										description={
											<Space.Compact style={{ width: '100%', marginTop: 8 }}>
												<Input value={opaqueId} readOnly size="large" />
												<Button
													size="large"
													icon={<CopyOutlined />}
													onClick={() => {
														navigator.clipboard.writeText(opaqueId);
														message.success(t('swap.swapIdCopied'));
													}}
												>
													{t('labels.copy')}
												</Button>
											</Space.Compact>
										}
									/>
								)}
							</div>
						)}
					</div>
				</Col>
			</Row>
		</div>
	);
}
