import NetworkTables from '@/components/NetworkTables';
import { useTranslation } from 'react-i18next';

export default function Activity() {
	const { t } = useTranslation();

	return (
		<div>
			<title>{`${t('titles.firoblock')} — ${t('titles.explorer')}`}</title>
			<NetworkTables />
		</div>
	);
}
