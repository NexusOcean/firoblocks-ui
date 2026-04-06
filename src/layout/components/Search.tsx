import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from 'antd';
import type { InputRef } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';

function detectLocal(value: string): string | null {
	const trimmed = value.trim();
	if (!trimmed) return null;
	if (/^\d+$/.test(trimmed)) return `/block/${trimmed}`;
	if (/^[a-fA-F0-9]{64}$/.test(trimmed)) return `/tx/${trimmed}`;
	if (/^a[1-9A-HJ-NP-Za-km-z]{25,40}$/.test(trimmed)) return `/address/${trimmed}`;
	return null;
}

export default function Search() {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState('');
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const inputRef = useRef<InputRef>(null);
	const navigate = useNavigate();

	function close() {
		setOpen(false);
		setValue('');
		setError(false);
		setLoading(false);
	}

	useEffect(() => {
		if (open) setTimeout(() => inputRef.current?.focus(), 50);
	}, [open]);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') close();
		};
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	}, []);

	async function handleSubmit() {
		const trimmed = value.trim();
		const local = detectLocal(trimmed);

		if (local) {
			close();
			navigate(local);
			return;
		}

		setError(true);
	}

	if (!open) {
		return (
			<Button
				type="text"
				icon={<SearchOutlined />}
				onClick={() => setOpen(true)}
				className="search-toggle"
			/>
		);
	}

	return (
		<div
			className="search-overlay"
			onClick={(e) => {
				if (e.target === e.currentTarget) close();
			}}
		>
			<Input
				ref={inputRef}
				value={value}
				onChange={(e) => {
					setValue(e.target.value);
					if (error) setError(false);
				}}
				onKeyDown={(e) => {
					if (e.key === 'Enter') handleSubmit();
				}}
				placeholder="Search by block, transaction, or address..."
				status={error ? 'error' : ''}
				prefix={loading ? <SearchOutlined spin /> : <SearchOutlined />}
				suffix={<CloseOutlined onClick={close} className="search-close" />}
				className="search-input"
				disabled={loading}
			/>
		</div>
	);
}
