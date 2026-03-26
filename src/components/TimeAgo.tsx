import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface TimeAgoProps {
	timestamp: number;
}

export default function TimeAgo({ timestamp }: TimeAgoProps) {
	return <span>{dayjs.unix(timestamp).fromNow(true)}</span>;
}
