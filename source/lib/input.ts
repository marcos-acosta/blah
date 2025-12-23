import {Key} from 'ink';

export type InputHandler = (input: string, key: Key) => void;

export function withBreaks(
	onQuit: () => void,
	onEscape: () => void,
	handler?: InputHandler,
): InputHandler {
	return (input, key) => {
		if (input === 'q') {
			onQuit();
		} else if (key.escape) {
			onEscape();
		} else if (handler) {
			handler(input, key);
		}
	};
}
