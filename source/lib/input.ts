import {Key} from 'ink';

export type InputHandler = (input: string, key: Key) => void;

export function withQuit(
	onQuit: () => void,
	handler?: InputHandler,
): InputHandler {
	return (input, key) => {
		if (input === 'q') {
			onQuit();
		} else if (handler) {
			handler(input, key);
		}
	};
}
