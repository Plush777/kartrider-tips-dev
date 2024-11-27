import * as R from 'style/components/ranking/RankingList.style';
import * as B from 'style/common/Button.style';
import RankingBoxItem from 'components/ranking/RankingBoxItem';
import RankingBottombar from 'components/ranking/RankingBottombar';

export default function RankingList({
	ranking,
	rankingFetchNextPage,
	rankingHasNextPage,
	rankingFetchingNextPage,
	isBottombar = true,
}) {
	const styles = {
		list: {
			styleType: 'list',
		},
		bottom: {
			styleType: 'bottom',
		},
	};

	return (
		<R.RankWrap>
			{isBottombar && <RankingBottombar ranking={ranking} styles={styles} />}

			<R.RankList>
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
									tagAs="strong"
								/>
							);
						});
					})}
			</R.RankList>
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
		</R.RankWrap>
	);
}
