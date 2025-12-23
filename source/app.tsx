import React, {useEffect, useState} from 'react';
import {getConfig} from './lib/filesystem.js';
import {BlahConfig} from './lib/interface.js';
import Home from './components/home.js';
import SetConfig from './components/set-config.js';
import Log from './components/log.js';
import {TitledBox} from '@mishieck/ink-titled-box';
import {getLocalDate} from './lib/dates.js';

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
	const [config, setConfig] = useState<BlahConfig | null>(null);

	useEffect(() => {
		const config = getConfig();
		if (!config) {
			setPage(Page.SET_CONFIG);
		} else {
			setConfig(config);
			setPage(Page.HOME);
		}
	}, []);

	const date = getLocalDate();

	return (
		<TitledBox
			padding={1}
			paddingLeft={2}
			borderStyle="single"
			titles={['blah', date]}
			titleJustify="center"
			borderColor={'yellow'}
		>
			{page === Page.HOME ? (
				<Home
					onLog={async () => setPage(Page.ADD_LOG)}
					onSearch={async () => setPage(Page.SEARCH)}
					onExplore={async () => setPage(Page.EXPLORE)}
				/>
			) : page === Page.SET_CONFIG ? (
				<SetConfig onComplete={async () => setPage(Page.HOME)} />
			) : page === Page.ADD_LOG ? (
				<Log
					config={config || undefined}
					goHome={async () => setPage(Page.HOME)}
				/>
			) : (
				<></>
			)}
		</TitledBox>
	);
}
