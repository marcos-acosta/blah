import React, {useEffect, useState} from 'react';
import {Box, Text, useApp, useInput} from 'ink';
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

	useInput(
		withQuit(exit, (input, key) => {
			if (key.upArrow || input === 'k') {
				previousIndex();
			} else if (key.downArrow || input === 'j') {
				nextIndex();
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
							<Text>{currentUpdate?.message}</Text>
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
