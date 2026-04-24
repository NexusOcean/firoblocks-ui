import { Segmented } from 'antd';
import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
	const { i18n } = useTranslation();

	return (
		<Segmented
			value={i18n.language}
			onChange={(v) => {
				const lang = v as string;
				i18n.changeLanguage(lang);
				localStorage.setItem('lang', lang);
			}}
			className="search-toggle"
			options={[
				{ label: 'EN', value: 'en' },
				{ label: 'RU', value: 'ru' }
			]}
		/>
	);
}
