import React, {useEffect, useState} from 'react';
import {Box, Text, useInput} from 'ink';
import {Update} from '../lib/interface.js';
import {formatDate} from '../lib/dates.js';

export type Props = {
	materializeLogs: () => Promise<void>;
	materializedLogs: Update[] | null;
	goHome: () => void;
};

export default function Explore(props: Props) {
	const [isLoading, setIsLoading] = useState(props.materializedLogs === null);
	const [error, setError] = useState(false);
	const [currentIndex, setCurrentIndex] = useState<number | undefined>(
		undefined,
	);

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

	useInput((input, key) => {
		if (key.escape) {
			props.goHome();
		} else if (key.upArrow || input === 'k') {
			previousIndex();
		} else if (key.downArrow || input === 'j') {
			nextIndex();
		}
	});

	useEffect(() => {
		if (props.materializedLogs === null) {
			props
				.materializeLogs()
				.catch(() => setError(true))
				.finally(() => setIsLoading(false));
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
				<Text color="gray">Loading...</Text>
			) : (
				<Box flexDirection="column">
					{updatesFromCurrentWeek.length === 0 ? (
						<Text color="gray">No updates from this week!</Text>
					) : (
						updatesFromCurrentWeek.map(update => (
							<Text
								key={update.timestamp}
								color={
									update.timestamp === currentUpdate?.timestamp
										? 'white'
										: 'gray'
								}
							>
								{formatDate(new Date(update.timestamp), true)}
							</Text>
						))
					)}
				</Box>
			)}
		</>
	);
}
