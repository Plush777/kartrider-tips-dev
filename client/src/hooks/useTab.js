import { useState, useEffect } from 'react';

export default function useTab(data) {
	let [tabIndex, setTabIndex] = useState(0);
	let [loadData, setLoadData] = useState(undefined);
	let [clicked, setClicked] = useState([false, false, false, false, false]);

	useEffect(() => {
		if (tabIndex === 0) setLoadData('일반');
		if (tabIndex === 1) setLoadData('고급');
		if (tabIndex === 2) setLoadData('희귀');
		if (tabIndex === 3) setLoadData('영웅');
		if (tabIndex === 4) setLoadData('전설');
	}, [tabIndex, data]);

	return { tabIndex, setTabIndex, clicked, setClicked, loadData };
}
