import { Card, Skeleton, Typography } from 'antd';
import type { ReactNode } from 'react';

const { Text, Title } = Typography;

interface StatCardProps {
	label: string;
	value?: string | number;
	loading?: boolean;
	icon: ReactNode;
}

export default function StatCard({ label, value, loading, icon }: StatCardProps) {
	return (
		<Card style={{ height: '100%', textAlign: 'center' }}>
			{loading ? (
				<Skeleton active paragraph={{ rows: 1 }} title={false} />
			) : (
				<>
					<div style={{ fontSize: 28, color: '#ba2a45', marginBottom: 8 }}>{icon}</div>
					<Text
						type="secondary"
						style={{
							fontSize: 14,
							letterSpacing: 1,
							textTransform: 'uppercase',
							display: 'block',
							fontWeight: 600,
							marginBottom: 6
						}}
					>
						{label}
					</Text>
					<Title level={3} style={{ margin: 0, fontSize: 24 }}>
						{value ?? '—'}
					</Title>
				</>
			)}
		</Card>
	);
}
