import * as G from 'style/components/sub/encyclopedia/Grid.style';
import { useState, useEffect, useRef } from 'react';
import GridItem from 'components/encyclopedia/GridItem';
import GridCollapse from 'components/encyclopedia/GridCollapse';

export default function Grid({ data, commonProps }) {
	const [toggleArray, setToggleArray] = useState([]);
	const collapseRef = useRef([]);

	console.log(data);
	// console.log(commonProps);

	// 현재 등급에 맞는 데이터 필터링
	const filteredData = data?.filter(item => item.등급 === commonProps.currentGrade);

	// 토글 배열 초기화
	useEffect(() => {
		if (filteredData) {
			const newToggleArray = Array.from({ length: filteredData.length }, () => false);
			setToggleArray(newToggleArray);
		}
	}, [filteredData?.length]);

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

	const displayData =
		commonProps.value.length > 0
			? filteredData?.filter(item => item.아이템명.toLowerCase().includes(commonProps.value.toLowerCase()))
			: filteredData;

	return (
		<G.Wrap>
			<G.List>
				{displayData?.map((item, index) => {
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
