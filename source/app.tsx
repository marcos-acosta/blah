import React, {useState} from 'react';
import {Box} from 'ink';
import {appendFileSync} from 'fs';
import TextInput from './components/text-input.js';

// type Props = {
// 	name: string | undefined;
// };

const LOG_FILE = '/tmp/daily-log.txt';

export default function App() {
	const [log, setLog] = useState('');

	const handleSubmit = (value: string) => {
		const timestamp = new Date().toISOString();
		const entry = `[${timestamp}] ${value}\n`;
		appendFileSync(LOG_FILE, entry, 'utf-8');
		setLog('');
	};

	return (
		<Box padding={1} borderStyle={'round'}>
			<TextInput
				value={log}
				onChange={setLog}
				placeholder="What happened today?"
				onSubmit={handleSubmit}
			/>
		</Box>
	);
}
