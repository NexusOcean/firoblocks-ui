import RecentTables from '@/components/RecentTables';
import { useTranslation } from 'react-i18next';

export default function Activity() {
	const { t } = useTranslation();

	return (
		<div>
			<title>{`${t('titles.firoblock')} — ${t('labels.activity')}`}</title>
			<RecentTables />
		</div>
	);
}
