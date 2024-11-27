import SCrankArrowUp from 'svg/ico-rank-arrow-up.svg';
import SCrankArrowDown from 'svg/ico-rank-arrow-down.svg';
import SCrankMinus from 'svg/ico-rank-minus.svg';
import * as R from 'style/components/ranking/RankingList.style';
import RankingDataContainer from 'components/ranking/RankingDataContainer';

export default function RankingBoxItem({
	styleType,
	title,
	rank,
	gameRankUpDown,
	sharesStatus,
	shares,
	useStoreCount,
	tagAs,
}) {
	const rankIconCondition = data => {
		if (data) {
			if (data.includes('up')) return <SCrankArrowUp width="12px" height="12px" fill="#eb0400" />;
			if (data.includes('down')) return <SCrankArrowDown width="12px" height="12px" fill="#0094ff" />;
			if (data.includes('noChange')) return <SCrankMinus width="12px" height="12px" fill="var(--disabled)" />;
		}
	};

	return (
		<R.RankBoxItem styleType={styleType}>
			<R.RankInnerBox direction="column" seq>
				<R.RankText styleType={styleType} styleProp="number" as={tagAs}>
					{rank}
				</R.RankText>
				{gameRankUpDown === '' && sharesStatus === '' ? null : (
					<R.RankStatus>
						<R.RankText styleType={styleType} styleProp="icon">
							{rankIconCondition(sharesStatus)}
						</R.RankText>
						<R.RankText styleType={styleType} styleProp="status">
							{gameRankUpDown}
						</R.RankText>
					</R.RankStatus>
				)}
			</R.RankInnerBox>
			<R.RankInnerBox direction="row">
				<R.RankInnerBox styleType={styleType} direction="column">
					<R.RankText as="h3" styleType={styleType} styleProp="gameName">
						{title}
					</R.RankText>
					<RankingDataContainer styleType={styleType} shares={shares} useStoreCount={useStoreCount} />
				</R.RankInnerBox>
			</R.RankInnerBox>
		</R.RankBoxItem>
	);
}
