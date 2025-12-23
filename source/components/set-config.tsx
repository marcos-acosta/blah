import {Box, Text} from 'ink';
import React, {useState} from 'react';
import TextInput from './text-input.js';
import {BlahConfig} from '../lib/interface.js';
import {writeConfig} from '../lib/filesystem.js';

export type Props = {
	onComplete: () => {};
};

export default function SetConfig(props: Props) {
	const [logPath, setLogPath] = useState('');

	const complete = () => {
		const config: BlahConfig = {logPath: logPath};
		writeConfig(config);
		props.onComplete();
	};

	return (
		<Box flexDirection="column">
			<Box marginBottom={1}>
				<Text>Setup blah!</Text>
			</Box>
			<Box flexDirection="row">
				<Box marginRight={1}>
					<Text color="gray">Where should your logs be stored?</Text>
				</Box>
				<TextInput
					value={logPath}
					onChange={setLogPath}
					placeholder="~/blah"
					onSubmit={complete}
				/>
			</Box>
		</Box>
	);
}
