import React, {useEffect, useState} from 'react';
import {getConfig, loadAllLogs} from './lib/filesystem.js';
import {BlahConfig, Update} from './lib/interface.js';
import Home from './components/home.js';
import SetConfig from './components/set-config.js';
import Log from './components/log.js';
import {TitledBox} from '@mishieck/ink-titled-box';
import Explore from './components/explore.js';
import {getLocalDate} from './lib/dates.js';
import {Text} from 'ink';

enum Page {
	PENDING = 0,
	SET_CONFIG = 1,
	ADD_LOG = 2,
	HOME = 3,
	EXPLORE = 4,
}

export default function App() {
	const [page, setPage] = useState(Page.PENDING);
	const [config, setConfig] = useState<BlahConfig | undefined>(undefined);
	const [materializedLogs, setMaterializedLogs] = useState<Update[] | null>(
		null,
	);

	const goHome = async () => {
		setPage(Page.HOME);
	};

	const goLog = async () => {
		setPage(Page.ADD_LOG);
	};

	const materializeLogs = async () => {
		if (!config) {
			return;
		}
		const logs = await loadAllLogs(config);
		setMaterializedLogs(logs);
	};

	const directlyMaterializeLogs = async (config: BlahConfig) => {
		const logs = await loadAllLogs(config);
		setMaterializedLogs(logs);
		return logs;
	};

	const goExplore = async () => {
		setPage(Page.EXPLORE);
	};

	useEffect(() => {
		const init = async () => {
			const config = getConfig();
			if (!config) {
				setPage(Page.SET_CONFIG);
			} else {
				setConfig(config);
				const logs = await directlyMaterializeLogs(config);

				// Decide which page to show
				const lastLog = logs && logs.at(-1);
				if (lastLog && lastLog.date !== getLocalDate()) {
					setPage(Page.ADD_LOG);
				} else {
					setPage(Page.HOME);
				}
			}
		};
		init();
	}, []);

	return (
		<TitledBox
			padding={1}
			paddingLeft={2}
			paddingRight={2}
			borderStyle="single"
			titles={['blah']}
			titleJustify="center"
			borderColor={'yellow'}
		>
			{page === Page.HOME ? (
				<Home onLog={goLog} onExplore={goExplore} />
			) : page === Page.SET_CONFIG ? (
				<SetConfig onComplete={goHome} />
			) : page === Page.ADD_LOG ? (
				<Log config={config} goHome={goHome} submitCallback={materializeLogs} />
			) : page === Page.EXPLORE ? (
				<Explore
					materializeLogs={materializeLogs}
					materializedLogs={materializedLogs}
					goHome={goHome}
				/>
			) : (
				<Text color="gray" italic>
					Loading...
				</Text>
			)}
		</TitledBox>
	);
}
