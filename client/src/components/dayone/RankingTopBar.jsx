import * as R from 'style/components/ranking/RankingList.style';

export default function RankingTopBar({ topbarText }) {
	return (
		<R.RankTopBarWrapper>
			{topbarText.map((item, index) => {
				return (
					<R.RankTopBarText data-index={index + 1} key={index}>
						{item.text}
					</R.RankTopBarText>
				);
			})}
		</R.RankTopBarWrapper>
	);
}
