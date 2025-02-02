import * as G from 'style/components/sub/encyclopedia/Grid.style';
import { useState, useEffect, useRef } from 'react';
import GridItem from 'components/encyclopedia/GridItem';
import GridCollapse from 'components/encyclopedia/GridCollapse';
import { filterDataByGrade } from 'data/sidebar';

export default function Grid({ data, commonProps }) {
	const [dataState, setDataState] = useState(undefined);
	const [toggleArray, setToggleArray] = useState([]);
	const collapseRef = useRef([]);

	// let karts = filterDataByGrade(commonProps.kartGradeData, data);

	// console.log(karts);

	useEffect(() => {
		if (data) {
			// setDataState(karts);
			const initArray = Array.from({ length: data.length }, () => false);
			setToggleArray(initArray);
		}

		// if (data && commonProps.value.length > 0) {
		// 	setDataState(data);
		// }

		if (data && commonProps.value.length > 0 && commonProps.clicked?.includes(true)) {
			commonProps.setValue('');
			commonProps.setClicked([false, false, false, false, false]);
			setDataState(karts);
		}
	}, [data, commonProps.tabIndex, commonProps.kartGradeData, commonProps.value]);

	const handleToggle = index => {
		const updatedArray = toggleArray.map((_, i) => {
			if (i === index) {
				// 클릭된 항목만 토글
				return !toggleArray[i];
			}
			// 나머지 항목은 현재 상태 유지
			return toggleArray[i];
		});

		setToggleArray(updatedArray);

		// 열리는 경우에만 스크롤
		if (updatedArray[index]) {
			setTimeout(() => {
				if (collapseRef.current[index]) {
					collapseRef.current[index].scrollIntoView({
						behavior: 'smooth',
						block: 'center',
					});
				}
			}, 1);
		}
	};

	return (
		<G.Wrap>
			<G.List>
				{data?.map((item, index) => {
					const toggle = toggleArray[index];

					return (
						<G.Item key={index}>
							<GridItem item={item} toggle={toggle} onToggle={() => handleToggle(index)} />

							{toggle && <GridCollapse item={item} index={index} collapseRef={collapseRef} />}
						</G.Item>
					);
				})}
			</G.List>
		</G.Wrap>
	);
}
