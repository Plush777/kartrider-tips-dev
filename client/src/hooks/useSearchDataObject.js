export default function useSearchDataObject(data, type = undefined, loadData = undefined) {
	return {
		data,
		type,
		loadData,
	};
}
