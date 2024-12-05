import * as M from 'style/components/main/Main.style';
import MainTitle from 'components/title/MainTitle';
import State from 'components/state/State';
import DayoneSkeleton from 'components/skeleton/Dayone';
import DayoneList from 'components/dayone/DayoneList';
import { mainTitle } from 'const';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchDayoneData } from 'scripts/api/ranking';
import ToggleSelector from 'components/selects/ToggleSelector';

export default function DayoneLayout() {
	const {
		data: dayone,
		isLoading: dayoneIsLoading,
		isError: dayoneIsError,
		fetchNextPage: dayoneFetchNextPage,
		hasNextPage: dayoneHasNextPage,
		isFetchingNextPage: dayoneFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ['dayoneLists'],
		queryFn: fetchDayoneData,
		initialPageParam: 1,
		staleTime: 1000 * 60 * 60 * 23, // 23시간
		gcTime: 1000 * 60 * 60 * 25, // 25시간
		getNextPageParam: (lastPage, pages) => {
			console.log(lastPage.nextCursor);
			return lastPage.nextCursor;
		},
	});

	const renderRankLingList = () => {
		if (dayoneIsLoading && !dayoneIsError) return <DayoneSkeleton />;
		if (dayoneIsError) return <State type="error" />;
		if (!dayoneIsLoading && !dayoneIsError)
			return (
				<DayoneList
					dayone={dayone}
					dayoneFetchNextPage={dayoneFetchNextPage}
					dayoneHasNextPage={dayoneHasNextPage}
					dayoneFetchingNextPage={dayoneFetchingNextPage}
				/>
			);
	};

	const handleClick = index => {
		if (index === 0) {
			console.log(0);
		} else if (index === 1) {
			console.log(1);
		}
	};

	const dayoneList = ['스피드전', '아이템전'];

	return (
		<M.ContainerBox both>
			<MainTitle icon="blockRanking" title={mainTitle.dayone} />
			<ToggleSelector data={dayoneList} clickFn={handleClick} />
			<M.MainInner name="ranking">{renderRankLingList()}</M.MainInner>
		</M.ContainerBox>
	);
}
