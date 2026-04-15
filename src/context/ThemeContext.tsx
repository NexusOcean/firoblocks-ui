import { createContext, useEffect, useState, type ReactNode } from 'react';
import { ConfigProvider, theme } from 'antd';

const { darkAlgorithm, defaultAlgorithm } = theme;

type Mode = 'light' | 'dark';

const darkTheme = {
	algorithm: darkAlgorithm,
	token: {
		colorPrimary: '#ba2a45',
		colorBgBase: '#0a0a0a',
		colorBgContainer: '#2a2a2a',
		fontFamily: "'Source Sans Pro', system-ui, sans-serif",
		fontSize: 16
	}
};

const lightTheme = {
	algorithm: defaultAlgorithm,
	token: {
		colorPrimary: '#ba2a45',
		colorBgBase: '#f9f7f7',
		colorBgContainer: '#ffffff',
		fontFamily: "'Source Sans Pro', system-ui, sans-serif",
		fontSize: 16
	}
};

const STORAGE_KEY = 'theme-mode';

interface ThemeContextValue {
	mode: Mode;
	toggleMode: () => void;
	setMode: (mode: Mode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getInitialMode = (): Mode => {
	const stored = localStorage.getItem(STORAGE_KEY) as Mode | null;
	if (stored === 'light' || stored === 'dark') return stored;
	if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
	return 'dark';
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [mode, setModeState] = useState<Mode>(getInitialMode);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, mode);
	}, [mode]);

	const setMode = (next: Mode) => setModeState(next);
	const toggleMode = () => setModeState((prev) => (prev === 'dark' ? 'light' : 'dark'));

	return (
		<ThemeContext.Provider value={{ mode, toggleMode, setMode }}>
			<ConfigProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
				{children}
			</ConfigProvider>
		</ThemeContext.Provider>
	);
};
