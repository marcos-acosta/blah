import React, {useState} from 'react';
import {BlahConfig} from '../lib/interface.js';
import {appendLog} from '../lib/filesystem.js';
import {Box} from 'ink';
import TextInput from './text-input.js';

export type Props = {
	config?: BlahConfig;
	goHome: () => void;
};

export default function Log(props: Props) {
	const [log, setLog] = useState('');

	const handleSubmit = (value: string) => {
		if (!props.config) {
			return;
		}
		appendLog(props.config, value);
		props.goHome();
	};

	return (
		<Box padding={1} paddingLeft={2} borderStyle="single">
			<TextInput
				value={log}
				onChange={setLog}
				placeholder="What's up?"
				onSubmit={handleSubmit}
				onEscape={props.goHome}
			/>
		</Box>
	);
}
