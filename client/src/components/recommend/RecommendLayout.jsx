import RecommendYoutubeList from 'components/recommend/RecommendYoutubeList';
import VideoState from 'components/state/VideoState';
import * as M from 'style/components/main/Main.style';
import MainTitle from 'components/title/MainTitle';
import { mainTitle } from 'const';
import CardSkeleton from 'components/skeleton/Card';

export default function RecommendLayout({ data, isLoading, isError }) {
	const sortedVideo =
		data &&
		data.sort((a, b) => {
			return new Date(b[0].snippet.publishedAt) - new Date(a[0].snippet.publishedAt);
		});

	return (
		<M.MainComponentBox>
			<MainTitle icon="fire" title={mainTitle.recommend} />

			<M.MainInner name="recommend">
				{isError && <VideoState type="error" />}

				{isLoading ? <CardSkeleton length={6} /> : <RecommendYoutubeList data={sortedVideo} isLoading={isLoading} />}
			</M.MainInner>
		</M.MainComponentBox>
	);
}
