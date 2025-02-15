export function filterData(dataArray, searchValue) {
	// console.log('필터링할 데이터 배열:', dataArray);
	// console.log('검색어:', searchValue);

	if (!Array.isArray(dataArray) || searchValue.trim() === '') {
		return [];
	}

	return dataArray.filter(item => item.아이템명.toLowerCase().includes(searchValue.toLowerCase()));
}

export const sidebarfilterData = (dataObject, query) => {
	if (!query) return [];

	const { data, type: dataType } = dataObject;

	const lowerCaseQuery = query.toLowerCase();

	if (dataType == undefined || dataType !== 'list') {
		const filterItems = items =>
			items.filter(
				item =>
					item.title.toLowerCase().includes(lowerCaseQuery) || (item.depth2 && filterItems(item.depth2).length > 0),
			);

		return data
			.map(section => {
				const filteredDepth1 = filterItems(section.depth1);
				return {
					...section,
					depth1: section.sectionTitle.toLowerCase().includes(lowerCaseQuery) ? section.depth1 : filteredDepth1,
				};
			})
			.filter(section => section.sectionTitle.toLowerCase().includes(lowerCaseQuery) || section.depth1.length > 0);
	}
};
