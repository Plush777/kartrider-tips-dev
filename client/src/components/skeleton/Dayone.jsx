import * as Sk from 'style/layout/Skeleton.style';

export default function Dayone() {
	return (
		<Sk.DayoneWrap>
			<Sk.DayoneTopBarWrapper>
				<Sk.DayoneTopbarText />
				<Sk.DayoneTopbarText />
				<Sk.DayoneTopbarText />
			</Sk.DayoneTopBarWrapper>
			<Sk.DayoneList>
				{Array.from({ length: 5 }).map((_, index) => {
					return (
						<Sk.DayoneItem key={index}>
							<Sk.DayoneText1Box>
								<Sk.DayoneText1 />
							</Sk.DayoneText1Box>
							<Sk.DayoneText2Box>
								<Sk.DayoneText2 />
							</Sk.DayoneText2Box>
							<Sk.DayoneText3Box>
								<Sk.DayoneText3 />
							</Sk.DayoneText3Box>
						</Sk.DayoneItem>
					);
				})}

				<Sk.DayoneLastItem />
			</Sk.DayoneList>

			<Sk.RankButtonWrap />
		</Sk.DayoneWrap>
	);
}
