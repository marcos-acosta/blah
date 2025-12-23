import React from 'react';
import {Box, Text, useApp, useInput} from 'ink';
import {getDayOfWeek} from '../lib/dates.js';

export type Props = {
	onSearch: () => void;
	onLog: () => void;
	onExplore: () => void;
};

export default function Home(props: Props) {
	const {exit} = useApp();

	useInput(input => {
		if (input === 'a') {
			props.onLog();
		} else if (input === 's') {
			props.onSearch();
		} else if (input === 'e') {
			props.onExplore();
		} else if (input === 'q') {
			exit();
		}
	});

	return (
		<Box flexDirection="column">
			<Box marginBottom={1}>
				<Text color="white">Happy {getDayOfWeek()}!</Text>
			</Box>
			<Box flexDirection="column">
				<Text color="gray">
					Press <Text color="white">a</Text> to log
				</Text>
				<Text color="gray">
					Press <Text color="white">s</Text> to search
				</Text>
				<Text color="gray">
					Press <Text color="white">e</Text> to explore
				</Text>
				<Text color="gray">
					Press <Text color="white">q</Text> to quit
				</Text>
			</Box>
		</Box>
	);
}
