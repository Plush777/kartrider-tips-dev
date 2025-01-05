'use client';

import { useState } from 'react';

export default function useSelect() {
	const [toggle, setToggle] = useState(false);

	const handleSelectClick = () => {
		setToggle(false);
	};

	const handleToggleSelect = () => {
		setToggle(!toggle);
	};

	return [toggle, setToggle, handleSelectClick, handleToggleSelect];
}
