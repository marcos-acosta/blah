import React from 'react';
import {Box, Text, useApp, useInput} from 'ink';

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
		<Box
			flexDirection="column"
			borderStyle="single"
			padding={1}
			paddingLeft={2}
		>
			<Box marginBottom={1}>
				<Text color="yellow">blah</Text>
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
