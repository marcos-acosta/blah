import React, {useEffect, useState} from 'react';
import {Box, Text, Transform, useApp, useInput} from 'ink';
import {Update} from '../lib/interface.js';
import {formatDate} from '../lib/dates.js';
import {withQuit} from '../lib/input.js';

export type Props = {
	materializeLogs: () => Promise<void>;
	materializedLogs: Update[] | null;
	goHome: () => void;
	logsNeedUpdate: boolean;
	clearLogsNeedUpdate: () => void;
};

export default function Explore(props: Props) {
	const [isLoading, setIsLoading] = useState(props.materializedLogs === null);
	const [error, setError] = useState(false);
	const [currentIndex, setCurrentIndex] = useState<number | undefined>(
		undefined,
	);
	const [showDetail, setShowDetail] = useState<boolean>(false);
	const {exit} = useApp();

	const nextIndex = () => {
		if (
			currentIndex !== undefined &&
			props.materializedLogs?.length &&
			currentIndex !== props.materializedLogs.length - 1
		) {
			setCurrentIndex(currentIndex + 1);
		}
	};

	const previousIndex = () => {
		if (
			currentIndex !== undefined &&
			props.materializedLogs?.length &&
			currentIndex !== 0
		) {
			setCurrentIndex(currentIndex - 1);
		}
	};

	// Find nearest log to a target date
	const findNearestLog = (targetDate: Date) => {
		if (!props.materializedLogs || !props.materializedLogs.length) {
			return;
		}

		const targetTime = targetDate.getTime();
		const MS_PER_DAY = 24 * 60 * 60 * 1000;
		let nearestIndex = 0;
		let minDiff = Math.abs(
			new Date((props.materializedLogs[0] as Update).timestamp).getTime() -
				targetTime,
		);

		for (let i = 1; i < props.materializedLogs.length; i++) {
			const logTime = new Date(
				(props.materializedLogs[i] as Update).timestamp,
			).getTime();
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

		if (currentIndex === undefined || !props.materializedLogs) {
			return;
		}

		const currentLog = props.materializedLogs[currentIndex];
		if (currentLog) {
			const currentDate = new Date(currentLog.timestamp);
			const targetDate = new Date(
				currentDate.getTime() + days * 24 * 60 * 60 * 1000,
			);

			findNearestLog(targetDate);
		}
	};

	useInput(
		withQuit(exit, (input, key) => {
			if (key.upArrow || input === 'k') {
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
				}
			} else {
				if (key.escape || input === 'b') {
					setShowDetail(false);
				}
			}
		}),
	);

	useEffect(() => {
		if (props.logsNeedUpdate) {
			props
				.materializeLogs()
				.catch(() => setError(true))
				.finally(() => {
					setIsLoading(false);
					props.clearLogsNeedUpdate();
				});
		}
	});

	useEffect(() => {
		if (props.materializedLogs && props.materializedLogs.length > 0) {
			const lastIndex = props.materializedLogs.length - 1;
			setCurrentIndex(lastIndex);
		}
	}, [props.materializedLogs]);

	const currentUpdate =
		(props.materializedLogs &&
			currentIndex !== undefined &&
			props.materializedLogs[currentIndex]) ||
		undefined;

	const updatesFromCurrentWeek =
		(props.materializedLogs &&
			currentUpdate &&
			props.materializedLogs.filter(
				update => update.week === currentUpdate.week,
			)) ||
		[];

	return (
		<>
			{error ? (
				<Text color="red">Error loading logs!</Text>
			) : isLoading ? (
				<Text color="gray" italic>
					Loading...
				</Text>
			) : showDetail ? (
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
					{updatesFromCurrentWeek.length === 0 ? (
						<Text color="gray">No updates from this week!</Text>
					) : (
						updatesFromCurrentWeek.map(update => {
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
				</Box>
			)}
		</>
	);
}
