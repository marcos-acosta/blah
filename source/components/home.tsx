import React from 'react';
import {Box, Text, useApp, useInput} from 'ink';
import {getDayOfWeek} from '../lib/dates.js';
import {withQuit} from '../lib/input.js';

export type Props = {
	onLog: () => void;
	onExplore: () => void;
};

export default function Home(props: Props) {
	const {exit} = useApp();

	useInput(
		withQuit(exit, (input, key) => {
			if (input === 'a') {
				props.onLog();
			} else if (input === 'b') {
				props.onExplore();
			} else if (key.escape) {
				exit();
			}
		}),
	);

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
					Press <Text color="white">b</Text> to browse
				</Text>
				<Text color="gray">
					Press <Text color="white">q</Text> to quit
				</Text>
			</Box>
		</Box>
	);
}
