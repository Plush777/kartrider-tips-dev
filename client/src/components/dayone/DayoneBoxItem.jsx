import * as R from 'style/components/ranking/RankingList.style';
import Ellipsis from 'components/ellipsis/Ellipsis';

export default function DayoneBoxItem({ rank, username, point }) {
	return (
		<li>
			<R.DayoneInnerBoxContainer>
				<R.DayoneSeq>
					<R.DayoneSeqText data-number={rank}>{rank}</R.DayoneSeqText>
				</R.DayoneSeq>
				<R.DayoneInnerBox>
					<R.DayoneRankTitleText>
						<Ellipsis text={username} />
					</R.DayoneRankTitleText>
					<R.DayonePointText>{point}</R.DayonePointText>
				</R.DayoneInnerBox>
			</R.DayoneInnerBoxContainer>
		</li>
	);
}
