import * as R from 'style/components/ranking/RankingList.style';

export default function DayoneBoxItem({ styleType, rank, username, point }) {
	return (
		<li>
			<R.DayoneInnerBoxContainer styleType={styleType}>
				<R.DayoneSeq>
					<R.DayoneSeqText data-number={rank}>{rank}</R.DayoneSeqText>
				</R.DayoneSeq>
				<R.DayoneInnerBox>
					<R.DayoneRankTitleText>{username}</R.DayoneRankTitleText>
					<R.DayonePointText>{point}</R.DayonePointText>
				</R.DayoneInnerBox>
			</R.DayoneInnerBoxContainer>
		</li>
	);
}
