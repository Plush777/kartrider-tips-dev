'use client';

import * as H from 'style/layout/Header.style';
import HeaderItems from './HeaderItems';
import { useEffect, useState } from 'react';
import appSetting from 'utils/appSetting';

export default function Header({ serverStates }) {
	const [myTheme, setMyTheme] = useState((serverStates.theme && serverStates.theme.value) || 'light');

	useEffect(() => {
		appSetting(serverStates);

		console.log(myTheme);
	}, []);

	return (
		<H.Header>
			<H.HeaderInner>
				<HeaderItems myTheme={myTheme} setMyTheme={setMyTheme} />
			</H.HeaderInner>
		</H.Header>
	);
}
