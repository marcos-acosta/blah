import TOML from '@iarna/toml';
import * as fs from 'fs';
import {promises as fsPromises} from 'fs';
import * as path from 'path';
import * as os from 'os';
import {BlahConfig, Update} from './interface.js';
import {getLocalDate} from './dates.js';

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

const getLogFilepath = (config: BlahConfig) =>
	path.join(config.logPath, LOG_FILENAME);

export const writeConfig = (config: BlahConfig): BlahConfig => {
	const expandedConfig = {
		...config,
		logPath: expandPath(config.logPath),
	};
	fs.writeFileSync(CONFIG_FILE, TOML.stringify(expandedConfig));
	fs.mkdirSync(expandedConfig.logPath, {recursive: true});
	return expandedConfig;
};

export const appendLog = (config: BlahConfig, message: string) => {
	const now = new Date();
	const update: Update = {
		message: message,
		timestamp: now.toISOString(),
		date: getLocalDate(),
	};
	fs.openSync(getLogFilepath(config), 'a');
	fs.appendFileSync(
		getLogFilepath(config),
		JSON.stringify(update) + '\n',
		'utf-8',
	);
};

export const loadAllLogs = async (config: BlahConfig) => {
	const data = await fsPromises.readFile(getLogFilepath(config), 'utf-8');
	return data
		.trim()
		.split('\n')
		.map(line => JSON.parse(line) as Update);
};
