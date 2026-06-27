import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

export default function LanguageSelect() {
	const { i18n } = useTranslation();

	return (
		<Select
			value={i18n.language}
			onChange={(lang) => {
				i18n.changeLanguage(lang);
				localStorage.setItem('lang', lang);
			}}
			className="search-toggle"
			classNames={{ popup: { root: 'language-select-popup' } }}
			options={[
				{ label: 'EN', value: 'en' },
				{ label: 'RU', value: 'ru' },
				{ label: 'ES', value: 'es' }
			]}
		/>
	);
}
