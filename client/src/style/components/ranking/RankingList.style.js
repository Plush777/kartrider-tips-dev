import styled, { css } from 'styled-components';

export const RankWrap = styled.div`
	position: relative;
`;

export const RankList = styled.ul`
	display: flex;
	flex-direction: column;
	row-gap: 12px;
	overflow-y: auto;
	max-height: var(--main-scroll-height);

	${({ theme }) => theme.laptop`
        max-height: calc(var(--main-scroll-height) - 5px);
    `};

	${({ theme }) => theme.tablet`
        &::-webkit-scrollbar {
            display: none;
        }

        -ms-overflow-style: none; /* 인터넷 익스플로러 */
        scrollbar-width: none; /* 파이어폭스 */
    `};
`;

export const RankInnerBoxContainer = styled.div`
	display: flex;
	align-items: center;
	column-gap: 12px;
	border-radius: 8px;
	background-color: var(--background5);
	padding: 20px;

	max-height: ${props => (props.styleType === 'bottom' ? '70px' : '')};
	transition: 0.3s ease-in-out;
	transition-property: background-color;
	height: 90px;

	${({ theme }) => theme.laptop`
        padding: 12px;
        column-gap: 12px;
    `};
`;

export const DayoneInnerBoxContainer = styled(RankInnerBoxContainer)`
	padding: 20px 0;
`;

export const Seq = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;

	min-width: 32px;
	height: 100%;
	align-items: center;
`;

export const DayoneSeq = styled(Seq)`
	min-width: 110px;
`;

export const SeqText = styled.strong`
	font-size: 1.375rem;
	color: var(--text1);

	&:where([data-number='1'], [data-number='2'], [data-number='3']) {
		color: var(--active);
	}
`;

export const DayoneSeqText = styled(SeqText)``;

export const StatusText = styled.span`
	margin-left: 1.5px;
	font-size: 0.8125rem;
	color: var(--text1);
`;

export const IconText = styled.span`
	font-size: 0.625rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.7px;
`;

export const TitleText = styled.h3`
	font-size: 1.125rem;
	color: var(--text1);
	font-weight: 600;
`;

export const DataTitleText = styled.span`
	font-size: 0.875rem;
	color: var(--description);
`;

export const DataNumberText = styled.span`
	font-size: 0.875rem;
	color: var(--text1);
`;

export const RankItemDataBox = styled.div`
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	column-gap: 10px;
`;

export const RankItemDataInnerBox = styled.div`
	display: flex;
	align-items: center;
	column-gap: 5px;
`;

export const DayoneInnerBox = styled.div`
	display: flex;
	align-items: center;
	flex: 1;
	padding-left: 10px;
`;

export const RankStatus = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
`;

export const RankItem = styled.div`
	flex: 1;
`;

export const RankItemWrapper = styled.div`
	height: 100%;
`;

export const DayoneItemWrapper = styled(RankItemWrapper)``;

export const RankItemBox = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding-left: 20px;
	height: 100%;
`;

export const DayoneRankTitleText = styled(TitleText)`
	margin: 0 auto;
`;

export const DayonePointText = styled(TitleText)`
	min-width: 130px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.125rem;
	color: var(--text1);
`;

export const BottomBar = styled.div`
	width: calc(100% - 14px);
	display: flex;
	align-items: center;
	column-gap: 20px;
	margin-top: 12px;

	svg {
		width: 8px;
		height: 8px;
	}

	${({ theme }) => theme.tablet`
        width: 100%;
    `};

	${({ theme }) => theme.mobile`
        .gameName{
            font-size: .875rem;
        }
    `};
`;

export const RankButtonWrap = styled.div`
	display: flex;
	align-items: center;
	margin-top: 20px;
`;

export const RankTopBarWrapper = styled.header`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	margin-bottom: 10px;
	padding: 15px 0;
	border-radius: 8px;
	background-color: var(--background5);
	z-index: 100;
`;

export const RankTopBarText = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1rem;
	color: var(--text1);

	&[data-index='1'] {
		min-width: 110px;
	}

	&[data-index='3'] {
		padding-right: 33px;
		min-width: 130px;
	}
`;
