import { Link } from 'react-router-dom';
import { theme } from 'antd';

const { useToken } = theme;

interface HashLinkProps {
	value: string;
	to: string;
	truncate?: boolean;
	mono?: boolean;
}

export default function HashLink({ value, to, truncate, mono }: HashLinkProps) {
	const { token } = useToken();

	const display = truncate ? `${value.slice(0, 12)}…${value.slice(-6)}` : value;

	return (
		<Link
			to={to}
			style={{
				color: token.colorPrimary,
				fontFamily: mono ? 'monospace' : undefined,
				textDecoration: 'none'
			}}
		>
			{display}
		</Link>
	);
}
