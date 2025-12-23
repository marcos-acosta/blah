import React, {useEffect, useState} from 'react';
import {getConfig, loadAllLogs} from './lib/filesystem.js';
import {BlahConfig, Update} from './lib/interface.js';
import Home from './components/home.js';
import SetConfig from './components/set-config.js';
import Log from './components/log.js';
import {TitledBox} from '@mishieck/ink-titled-box';
import Explore from './components/explore.js';

enum Page {
	PENDING = 0,
	SET_CONFIG = 1,
	ADD_LOG = 2,
	SEARCH = 3,
	HOME = 4,
	EXPLORE = 5,
}

export default function App() {
	const [page, setPage] = useState(Page.PENDING);
	const [config, setConfig] = useState<BlahConfig | undefined>(undefined);
	const [materializedLogs, setMaterializedLogs] = useState<Update[] | null>(
		null,
	);
	const [logsNeedUpdate, setLogsNeedUpdate] = useState(true);

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
		setMaterializedLogs(await loadAllLogs(config));
	};

	const goExplore = async () => {
		setPage(Page.EXPLORE);
	};

	useEffect(() => {
		const config = getConfig();
		if (!config) {
			setPage(Page.SET_CONFIG);
		} else {
			setConfig(config);
			goHome();
		}
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
				<Home
					onLog={goLog}
					onSearch={async () => setPage(Page.SEARCH)}
					onExplore={goExplore}
				/>
			) : page === Page.SET_CONFIG ? (
				<SetConfig onComplete={goHome} />
			) : page === Page.ADD_LOG ? (
				<Log
					config={config}
					goHome={goHome}
					submitCallback={async () => setLogsNeedUpdate(true)}
				/>
			) : page === Page.EXPLORE ? (
				<Explore
					materializeLogs={materializeLogs}
					materializedLogs={materializedLogs}
					logsNeedUpdate={logsNeedUpdate}
					clearLogsNeedUpdate={async () => setLogsNeedUpdate(false)}
					goHome={goHome}
				/>
			) : (
				<></>
			)}
		</TitledBox>
	);
}
