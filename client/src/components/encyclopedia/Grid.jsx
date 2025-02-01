import * as G from 'style/components/sub/encyclopedia/Grid.style';
import { useState, useEffect, useRef } from 'react';
import GridItem from 'components/encyclopedia/GridItem';
import GridCollapse from 'components/encyclopedia/GridCollapse';
import { filterDataByGrade } from 'data/sidebar';

export default function Grid({ data, commonProps }) {
	const [dataState, setDataState] = useState(undefined);
	const [toggleArray, setToggleArray] = useState([]);
	const collapseRef = useRef([]);

	let karts = filterDataByGrade(commonProps.kartGradeData, data);

	console.log(data);

	useEffect(() => {
		if (data) {
			setDataState(karts);
			const initArray = Array.from({ length: karts.length }, () => false);
			setToggleArray(initArray);
		}

		if (data && commonProps.value.length > 0) {
			setDataState(data);
		}

		if (data && commonProps.value.length > 0 && commonProps.clicked?.includes(true)) {
			commonProps.setValue('');
			commonProps.setClicked([false, false, false, false, false]);
			setDataState(karts);
		}
	}, [data, commonProps.tabIndex, commonProps.kartGradeData, commonProps.value]);

	return (
		<G.Wrap>
			<G.List>
				{data?.map((item, index) => {
					// const uniqueIndex = kartIndex * 100 + kartItemIndex;
					const toggle = toggleArray[item.번호];

					console.log(item);

					return (
						<G.Item key={item.번호}>
							<GridItem
								item={item}
								toggle={toggle}
								toggleArray={toggleArray}
								setToggleArray={setToggleArray}
								collapseRef={collapseRef}
							/>

							{toggle && <GridCollapse item={item} kartItemIndex={item.번호} collapseRef={collapseRef} />}
						</G.Item>
					);
				})}
			</G.List>
		</G.Wrap>
	);
}
