import { useState } from 'react';
import { sidebarfilterData } from 'data/sidebar';

export default function useSearch(dataObject) {
	const [value, setValue] = useState('');
	const [results, setResults] = useState([]);
	const [focused, setFocused] = useState(false);

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

		// 데이터 타입에 따라 다른 필터링 로직 적용
		if (dataObject?.type === 'list') {
			// GridWrapper용 필터링
			const filteredResults =
				dataObject.data?.filter(
					item =>
						item.아이템명.toLowerCase().includes(e.target.value.toLowerCase()) && item.등급 === dataObject.loadData,
				) || [];
			setResults(filteredResults);
		} else {
			// Sidebar용 필터링
			const sidebarResults =
				sidebarfilterData(
					{
						data: dataObject.data,
						type: dataObject.type,
					},
					e.target.value,
				) || [];
			setResults(sidebarResults);
		}
	};

	const handleValueRemove = () => {
		setValue('');
		setResults([]);
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
