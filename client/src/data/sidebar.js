export function filterData(dataArray, searchValue) {
	// console.log('필터링할 데이터 배열:', dataArray);
	// console.log('검색어:', searchValue);

	if (!Array.isArray(dataArray) || searchValue.trim() === '') {
		return [];
	}

	return dataArray.filter(item => item.아이템명.toLowerCase().includes(searchValue.toLowerCase()));
}
