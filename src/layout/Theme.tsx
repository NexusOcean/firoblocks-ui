import { Button } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle = () => {
	const { mode, toggleMode } = useTheme();

	const icon = mode === 'dark' ? <BulbFilled /> : <BulbOutlined />;

	return <Button type="text" icon={icon} onClick={toggleMode} className="search-toggle" />;
};
