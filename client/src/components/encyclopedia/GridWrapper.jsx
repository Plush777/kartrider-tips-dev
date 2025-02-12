'use client';

import Tab from 'components/tabs/Tab';
import { tabArray, engineArray, modeArray, encyInitArray } from 'data/karts';
import useTab from 'hooks/useTab';
import Container from 'components/sub/grid/Container';
import useSearch from 'hooks/useSearch';
import SearchItem from 'components/search/SearchItem';
import useSearchDataObject from 'hooks/useSearchDataObject';
import { useGetExcelQuries } from 'hooks/useGetExcelQuries';
import GridSkeleton from 'components/skeleton/Grid';
import { useEffect, useState } from 'react';
import NoMatch from 'components/search/NoMatch';
import Select from 'components/selects/Select';
import SearchResult from 'components/search/SearchResult';

import * as G from 'style/components/sub/encyclopedia/Grid.style';

export default function GridWrapper({ type }) {
	const [containerActive, setContainerActive] = useState('');
	let [engineKey, setEngineKey] = useState(engineArray);
	let [modeKey, setModeKey] = useState(modeArray);
	// let [selectedData] = useState(undefined);

	const { kart_a2, kart_n1, character } = useGetExcelQuries();

	const [selectedEngine, setSelectedEngine] = useState(kart_a2.data);

	const typeCondition = value => {
		if (value === 'data') {
			if (type === 'karts') return selectedEngine || [];
			if (type === 'characters') return character.data || [];

			return [];
		}

		if (value === 'tab') {
			if (type === 'karts') return 3;
			if (type === 'characters') return 4;

			return null;
		}

		return null;
	};

	const { tabIndex, setTabIndex, clicked, setClicked, loadData, setLoadData } = useTab(typeCondition('data'), callback);
	const dataObject = useSearchDataObject(typeCondition('data'), 'list', loadData);

	const {
		value,
		setValue,
		results,
		setResults,
		focused,
		handleFocus,
		handleBlur,
		handleValueChange,
		handleValueRemove,
	} = useSearch(dataObject);

	function callback() {
		if (tabIndex === 0) setLoadData('일반');
		if (tabIndex === 1) setLoadData('고급');
		if (tabIndex === 2) setLoadData('희귀');
		if (tabIndex === 3) setLoadData('영웅');
		if (tabIndex === 4) setLoadData('전설');
	}

	const dataProps = {
		ency: {
			loopData: typeCondition('data'),
		},
		search: {
			loopData: results,
		},
	};

	const queryObject = {
		data: kart_a2.data || kart_n1.data || character.data,
		isLoading: kart_a2.isLoading || kart_n1.isLoading || character.isLoading,
		isError: kart_a2.isError || kart_n1.isError || character.isError,
		isFetched: kart_a2.isFetched || kart_n1.isFetched || character.isFetched,
	};

	const commonProps = {
		currentGrade: loadData,
		tabIndex: tabIndex,
		value: value,
		setValue: setValue,
		clicked: clicked,
		setClicked: setClicked,
		setContainerActive: setContainerActive,
		isLoading: queryObject.isLoading,
		dataType: 'list',
		dataCategory: type,
	};

	console.log(commonProps);

	const dataPropsType = value.length > 0 ? dataProps.search : dataProps.ency;

	// console.log(commonProps.value);
	// console.log('GridWrapper Results:', results);

	const renderResultCondition = () => {
		// 데이터 로딩 중이면 스켈레톤 UI 표시
		if (queryObject.isLoading) {
			return Array.from({ length: 10 }, (_, i) => <GridSkeleton key={i} />);
		}

		// 데이터가 로드된 후 실행
		if (queryObject.isFetched) {
			// 🔹 검색 결과가 없을 때
			if (value.length > 0 && results.length === 0) {
				if (!clicked.includes(true)) {
					return <NoMatch styleProp="grid" text={'이런, 조건에 맞는 항목이 없네요!'} />;
				}
			}

			// 🔹 데이터가 완전히 준비되었는지 체크
			if (!selectedEngine || selectedEngine.length === 0) {
				return <GridSkeleton />; // 데이터를 아직 불러오는 중이라면 스켈레톤 유지
			}

			// 🔹 선택된 엔진과 등급에 따른 데이터 체크
			const currentGradeData = selectedEngine?.filter(item => item.등급 === loadData);

			if (queryObject.isFetched && selectedEngine.length > 0 && currentGradeData?.length === 0) {
				return <NoMatch styleProp="grid" text={'이런, 조건에 맞는 항목이 없네요!'} />;
			}

			return <SearchResult commonProps={commonProps} dataProps={dataPropsType} />;
		}
	};

	useEffect(() => {
		queryObject.isLoading ? setContainerActive('500px') : setContainerActive('auto');
	}, [queryObject.data, tabIndex]);

	//탭 넘기면 검색값과 셀렉트 값 초기화
	useEffect(() => {
		setValue('');
		setResults([]);
	}, [tabIndex]);

	useEffect(() => {
		// key가 바뀔 때만 데이터 업데이트
		const isA2Selected = engineKey.includes('A2');
		const isN1Selected = engineKey.includes('N1');

		const isItemModeSelected = modeKey && modeKey.includes('아이템');
		const isSpeedModeSelected = modeKey && modeKey.includes('스피드');

		let selectedData = [];

		if (isA2Selected && kart_a2.isFetched) {
			selectedData = [...selectedData, ...kart_a2.data];
		}

		if (isN1Selected && kart_n1.isFetched) {
			selectedData = [...selectedData, ...kart_n1.data];
		}

		selectedData = selectedData.filter(item => {
			return (isItemModeSelected && item.모드구분 === '아이템') || (isSpeedModeSelected && item.모드구분 === '스피드');
		});

		// 상태 업데이트
		setSelectedEngine(selectedData);

		//selectedEngine이 업데이트될 때마다 검색 결과(results)도 다시 필터링
		if (value.length > 0) {
			const newResults = selectedData.filter(item => {
				return item.아이템명.toLowerCase().includes(value.toLowerCase()) && item.등급 === loadData;
			});
			setResults(newResults);
		}

		console.log(selectedEngine);
	}, [engineKey, modeKey, kart_a2.isFetched, kart_n1.isFetched, kart_a2.data, kart_n1.data, value, loadData]);

	return (
		<div className="reset">
			<Container displayProp="flex" alignItems="flex-start" flexDirection="column">
				<Tab
					value={value}
					type="ency"
					tabIndex={tabIndex}
					setTabIndex={setTabIndex}
					clicked={clicked}
					setClicked={setClicked}
					data={tabArray}
					marginBottom="15px"
					disabledIndex={typeCondition('tab')}
					styleProps="ency"
					indicator={true}
				/>

				<G.SearchBox>
					{type === 'karts' && (
						<>
							<Select
								data="engine"
								initKey={encyInitArray}
								selectKey={engineKey}
								setSelectKey={setEngineKey}
								width="120px"
								height="36px"
							/>
							<Select
								data="mode"
								initKey={encyInitArray}
								selectKey={modeKey}
								setSelectKey={setModeKey}
								width="120px"
								height="36px"
							/>
						</>
					)}

					<SearchItem
						inputDisabled={queryObject.isLoading ? true : false}
						value={value}
						focused={focused}
						onFocusFn={handleFocus}
						onBlurFn={handleBlur}
						onChangeFn={handleValueChange}
						removeFn={handleValueRemove}
						placeholder={'찾고싶은 카트바디를 검색해보세요!'}
						inputId={'s02'}
						styleProps="ency"
						inputStyleClassName="encyInput"
					/>
				</G.SearchBox>
			</Container>

			<Container minHeight={containerActive} styleProp={queryObject.isLoading ? 'grid' : ''}>
				{renderResultCondition()}
			</Container>
		</div>
	);
}
