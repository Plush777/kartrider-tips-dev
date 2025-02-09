import { useState } from 'react';
import { filterData } from 'data/sidebar';

export default function useSearch(dataObject) {
	const [value, setValue] = useState('');
	const [results, setResults] = useState([]);
	const [focused, setFocused] = useState(false);

	// console.log('dataObject 확인:', dataObject);

	const handleFocus = () => {
		setFocused(true);
	};

	const handleBlur = e => {
		if (e.target.value === '') {
			setFocused(false);
		}
	};

	const handleValueChange = e => {
		setValue(e.target.value);

		// dataObject.data로 필터링하도록 수정
		if (Array.isArray(dataObject.data)) {
			setResults(filterData(dataObject.data, e.target.value));
			console.log(dataObject.data);
		} else {
			setResults([]); // 데이터가 없을 경우 빈 배열 반환
		}
	};

	const handleValueRemove = () => {
		setValue('');
		setFocused(false);
	};

	return {
		value,
		setValue,
		results,
		setResults,
		focused,
		handleFocus,
		handleBlur,
		handleValueChange,
		handleValueRemove,
	};
}
