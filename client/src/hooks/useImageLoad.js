import { useState } from 'react';

export default function useImageLoad() {
	const [loadedMap, setLoadedMap] = useState({});
	const [imageErrorMap, setImageErrorMap] = useState({});

	const handleImageError = itemId => {
		setImageErrorMap(prev => ({
			...prev,
			[itemId]: true,
		}));
	};

	const loadingComplete = itemId => {
		setLoadedMap(prev => ({
			...prev,
			[itemId]: true,
		}));
	};

	return { loadedMap, imageErrorMap, handleImageError, loadingComplete };
}
