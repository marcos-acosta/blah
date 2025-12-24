import React, {useEffect, useState} from 'react';
import {Box, Text, Transform, useApp, useInput} from 'ink';
import {Update} from '../lib/interface.js';
import {formatDate} from '../lib/dates.js';
import TextInput from './text-input.js';

export type Props = {
	materializeLogs: () => Promise<void>;
	materializedLogs: Update[] | null;
	goHome: () => void;
};

const MAX_NUM_LOGS_TO_SHOW = 7;
const LOGS_ON_EITHER_SIDE = Math.floor(MAX_NUM_LOGS_TO_SHOW / 2);

export default function Explore(props: Props) {
	const [currentIndex, setCurrentIndex] = useState<number | undefined>(
		undefined,
	);
	const [showDetail, setShowDetail] = useState<boolean>(false);
	const [searchMode, setSearchMode] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredLogs, setFilteredLogs] = useState<Update[] | null>(null);
	const {exit} = useApp();

	const nextIndex = () => {
		if (
			currentIndex !== undefined &&
			filteredLogs?.length &&
			currentIndex !== filteredLogs.length - 1
		) {
			setCurrentIndex(currentIndex + 1);
		}
	};

	const previousIndex = () => {
		if (
			currentIndex !== undefined &&
			filteredLogs?.length &&
			currentIndex !== 0
		) {
			setCurrentIndex(currentIndex - 1);
		}
	};

	// Find nearest log to a target date
	const findNearestLog = (targetDate: Date) => {
		if (!filteredLogs || !filteredLogs.length) {
			return;
		}

		const targetTime = targetDate.getTime();
		const MS_PER_DAY = 24 * 60 * 60 * 1000;
		let nearestIndex = 0;
		let minDiff = Math.abs(
			new Date((filteredLogs[0] as Update).timestamp).getTime() - targetTime,
		);

		for (let i = 1; i < filteredLogs.length; i++) {
			const logTime = new Date((filteredLogs[i] as Update).timestamp).getTime();
			const diff = Math.abs(logTime - targetTime);
			const diffInDays = Math.floor(diff / MS_PER_DAY);

			// Early exit if we found a log on the same day
			if (diffInDays === 0) {
				setCurrentIndex(i);
				return;
			}

			if (diff < minDiff) {
				minDiff = diff;
				nearestIndex = i;
			}
		}

		setCurrentIndex(nearestIndex);
	};

	// Jump by time period
	const jumpByDays = (days: number) => {
		if (days === 0) {
			return;
		}

		if (currentIndex === undefined || !filteredLogs) {
			return;
		}

		const currentLog = filteredLogs[currentIndex];
		if (currentLog) {
			const currentDate = new Date(currentLog.timestamp);
			const targetDate = new Date(
				currentDate.getTime() + days * 24 * 60 * 60 * 1000,
			);

			findNearestLog(targetDate);
		}
	};

	useInput((input, key) => {
		if (!searchMode) {
			if (input === 'q') {
				exit();
			} else if (key.upArrow || input === 'k') {
				previousIndex();
			} else if (key.downArrow || input === 'j') {
				nextIndex();
			} else if (input === 'w') {
				jumpByDays(7);
			} else if (input === 'W') {
				jumpByDays(-7);
			} else if (input === 'm') {
				jumpByDays(30);
			} else if (input === 'M') {
				jumpByDays(-30);
			} else if (input === 'y') {
				jumpByDays(365);
			} else if (input === 'Y') {
				jumpByDays(-365);
			}
			if (!showDetail) {
				if (key.escape || input === 'b') {
					props.goHome();
				} else if (key.return && currentIndex !== undefined) {
					setShowDetail(true);
				} else if (input === '/') {
					setSearchMode(true);
				} else if (input === 'c' && searchQuery) {
					// Clear search when 'c' is pressed and there's an active search
					setSearchQuery('');
				}
			} else {
				if (key.escape || input === 'b') {
					setShowDetail(false);
				}
			}
		} else {
			// In search mode (editing the query)
			if (key.escape) {
				// Escape: clear search and exit search mode
				setSearchQuery('');
				setSearchMode(false);
			} else if (key.return) {
				// Enter: keep search and exit search mode (allows navigation)
				setSearchMode(false);
			}
		}
	});

	// Filter logs based on search query
	useEffect(() => {
		if (!props.materializedLogs) {
			setFilteredLogs(null);
			return;
		}

		if (!searchQuery) {
			setFilteredLogs(props.materializedLogs);
			return;
		}

		try {
			const regex = new RegExp(searchQuery, 'i');
			const filtered = props.materializedLogs.filter(log =>
				regex.test(log.message),
			);
			setFilteredLogs(filtered);
		} catch (error) {
			// Invalid regex, show all logs
			setFilteredLogs([]);
		}
	}, [props.materializedLogs, searchQuery]);

	// Set initial index when filtered logs change
	useEffect(() => {
		if (filteredLogs && filteredLogs.length > 0) {
			const lastIndex = filteredLogs.length - 1;
			setCurrentIndex(lastIndex);
		}
	}, [filteredLogs]);

	const currentUpdate =
		(filteredLogs &&
			currentIndex !== undefined &&
			filteredLogs[currentIndex]) ||
		undefined;

	let updatesToShow: Update[] = [];
	if (filteredLogs && currentIndex !== undefined) {
		const logsAfterCurrent = filteredLogs.length - currentIndex - 1;
		if (
			currentIndex < LOGS_ON_EITHER_SIDE &&
			logsAfterCurrent < LOGS_ON_EITHER_SIDE
		) {
			// Not enough on either side, show all logs
			updatesToShow = filteredLogs;
		} else if (
			currentIndex >= LOGS_ON_EITHER_SIDE &&
			logsAfterCurrent >= LOGS_ON_EITHER_SIDE
		) {
			// Enough logs on both sides, grab even amount from both sides
			updatesToShow = filteredLogs.slice(
				currentIndex - LOGS_ON_EITHER_SIDE,
				currentIndex + LOGS_ON_EITHER_SIDE + 1,
			);
		} else {
			if (currentIndex < LOGS_ON_EITHER_SIDE) {
				// Constrained by backside
				updatesToShow = filteredLogs.slice(0, MAX_NUM_LOGS_TO_SHOW);
			} else if (logsAfterCurrent < LOGS_ON_EITHER_SIDE) {
				// Constrained by frontsize
				updatesToShow = filteredLogs.slice(
					Math.max(filteredLogs.length - MAX_NUM_LOGS_TO_SHOW, 0),
				);
			}
		}
	}

	return (
		<>
			{showDetail ? (
				<Box flexDirection="column">
					{currentUpdate ? (
						<>
							<Text color="gray">
								{formatDate(new Date(currentUpdate?.timestamp), 'full')}
							</Text>
							<Transform transform={(line, _) => line.trim()}>
								<Text>{currentUpdate?.message}</Text>
							</Transform>
						</>
					) : (
						<Text color="red">Error loading current log.</Text>
					)}
				</Box>
			) : (
				<Box flexDirection="column">
					{updatesToShow.length === 0 ? (
						<Text color="gray" italic>
							No logs found!
						</Text>
					) : (
						updatesToShow.map(update => {
							const isSelected = update.timestamp === currentUpdate?.timestamp;
							const color = isSelected ? 'white' : 'gray';

							return (
								<Box key={update.timestamp} flexDirection="row">
									<Box width={35} height={1} flexShrink={0}>
										<Text color={color}>
											{formatDate(new Date(update.timestamp), 'hour')}
										</Text>
									</Box>
									<Box height={1} overflowX="hidden" overflowY="hidden">
										<Text color={color} wrap="truncate-end">
											{update.message}
										</Text>
									</Box>
								</Box>
							);
						})
					)}
					{searchMode ? (
						<Box flexDirection="row" marginTop={1}>
							<Text color="gray">/</Text>
							<TextInput value={searchQuery} onChange={setSearchQuery} focus />
						</Box>
					) : searchQuery ? (
						<Box flexDirection="row" marginTop={1}>
							<Text color="gray">/{searchQuery}</Text>
						</Box>
					) : null}
				</Box>
			)}
		</>
	);
}
