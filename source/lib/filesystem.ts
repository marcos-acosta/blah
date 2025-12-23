import TOML from '@iarna/toml';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {BlahConfig, Update} from './interface.js';

const CONFIG_FILE = path.join(os.homedir(), '.blah.toml');
const LOG_FILENAME = 'logs.ndjson';

function expandPath(filePath: string): string {
	if (filePath.startsWith('~/')) {
		return path.join(os.homedir(), filePath.slice(2));
	}
	return filePath;
}

export const getConfig = (): BlahConfig | undefined => {
	try {
		const configString: string = fs.readFileSync(CONFIG_FILE, 'utf-8');
		return TOML.parse(configString) as BlahConfig;
	} catch {
		return undefined;
	}
};

export const writeConfig = (config: BlahConfig) => {
	const expandedConfig = {
		...config,
		logPath: expandPath(config.logPath),
	};
	fs.writeFileSync(CONFIG_FILE, TOML.stringify(expandedConfig));
	fs.mkdirSync(expandedConfig.logPath, {recursive: true});
};

export const appendLog = (config: BlahConfig, message: string) => {
	const fullLogPath = path.join(config.logPath, LOG_FILENAME);
	const now = new Date();
	const update: Update = {
		message: message,
		timestamp: now.toISOString(),
		date: now.toISOString().split('T')[0] as string,
		tags: [],
	};
	fs.appendFileSync(fullLogPath, JSON.stringify(update), 'utf-8');
};
