import * as R from 'style/components/ranking/RankingList.style';
import * as B from 'style/common/Button.style';
import RankingBoxItem from 'components/ranking/RankingBoxItem';
import RankingBottombar from 'components/ranking/RankingBottombar';

export default function RankingList({ ranking, rankingFetchNextPage, rankingHasNextPage, rankingFetchingNextPage }) {
	const styles = {
		list: {
			styleType: 'list',
		},
		bottom: {
			styleType: 'bottom',
		},
	};

	const rankingDescriptions = [
		{
			text: '순위 데이터는 더로그 (https://www.thelog.co.kr/) 에서 가져오고 있습니다.',
		},
		{
			text: '15분 간격으로 데이터가 자동 새로고침 됩니다.',
		},
	];

	console.log(ranking);

	return (
		<R.RankWrap>
			<R.RankInner>
				<R.RankDescription>
					{rankingDescriptions.map((item, index) => (
						<R.RankDescriptionText key={index}>{item.text}</R.RankDescriptionText>
					))}
				</R.RankDescription>
				<R.RankList scrollHeight="calc(100vh - 410px)">
					{ranking &&
						ranking.pages.map(page => {
							return page.result?.map(result => {
								const { title, rank, gameRankUpDown, sharesStatus, shares, targetDate, useStoreCount } = result;

								return (
									<RankingBoxItem
										key={rank}
										styleType={styles.list.styleType}
										title={title}
										rank={rank}
										gameRankUpDown={gameRankUpDown}
										sharesStatus={sharesStatus}
										shares={shares}
										targetDate={targetDate}
										useStoreCount={useStoreCount}
										tagAs="li"
									/>
								);
							});
						})}
				</R.RankList>

				<RankingBottombar ranking={ranking} styles={styles} tagAs="div" />

				<R.RankButtonWrap>
					<B.Button
						type="button"
						typeProp="rank"
						disabled={rankingFetchingNextPage || !rankingHasNextPage ? true : false}
						onClick={() => {
							rankingFetchNextPage();
						}}
					>
						더보기
					</B.Button>
				</R.RankButtonWrap>
			</R.RankInner>
		</R.RankWrap>
	);
}
