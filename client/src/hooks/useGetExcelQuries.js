import { useQuery } from '@tanstack/react-query';
import { fetchExcelData } from 'utils/excelReader';

export function useGetExcelQuries() {
	const file1Query = useQuery({
		queryKey: ['excel', 'file1'],
		queryFn: () => fetchExcelData('/data/xlsx/kartdocs_카트바디도감_a2.xlsx'),
	});

	const file2Query = useQuery({
		queryKey: ['excel', 'file2'],
		queryFn: () => fetchExcelData('/data/xlsx/kartdocs_카트바디도감_n1.xlsx'),
	});

	const file3Query = useQuery({
		queryKey: ['excel', 'file3'],
		queryFn: () => fetchExcelData('/data/xlsx/kartdocs_캐릭터도감.xlsx'),
	});

	return {
		kart_a2: file1Query.data,
		kart_n1: file2Query.data,
		character: file3Query.data,
		isLoading: file1Query.isLoading || file2Query.isLoading || file3Query.isLoading,
		isError: file1Query.isError || file2Query.isError || file3Query.isError,
	};
}
