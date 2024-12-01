import * as R from 'style/components/ranking/RankingList.style';
import * as B from 'style/common/Button.style';
import DayoneBoxItem from './DayoneBoxItem';
import RankingTopBar from './RankingTopBar';

export default function DayoneList({ dayone, dayoneFetchNextPage, dayoneHasNextPage, dayoneFetchingNextPage }) {
	const styles = {
		list: {
			styleType: 'list',
		},
	};

	const topbarText = [
		{
			text: '순위',
		},
		{
			text: '닉네임',
		},
		{
			text: '포인트',
		},
	];

	console.log(dayone);

	return (
		<R.RankWrap>
			<R.RankInner>
				<RankingTopBar topbarText={topbarText} />
				<R.RankList scrollHeight="calc(100vh - 384px)">
					{dayone &&
						dayone.pages.map(page => {
							return page.result?.map((result, index) => {
								const { rank, name, score } = result;

								return <DayoneBoxItem key={index} rank={rank} username={name} point={score} tagAs="strong" />;
							});
						})}
				</R.RankList>
				<R.RankButtonWrap>
					<B.Button
						type="button"
						typeProp="rank"
						disabled={dayoneFetchingNextPage || !dayoneHasNextPage ? true : false}
						onClick={() => {
							dayoneFetchNextPage();
						}}
					>
						더보기
					</B.Button>
				</R.RankButtonWrap>
			</R.RankInner>
		</R.RankWrap>
	);
}
