'use client';

import DayoneLayout from 'components/dayone/DayoneLayout';
import ChzzkLiveLayout from 'components/chzzk/ChzzkLiveLayout';
import RecentYoutubeLayout from 'components/recentYoutube/RecentYoutubeLayout';
import RecommendLayout from 'components/recommend/RecommendLayout';
import RecentNewsLayout from 'components/recentNews/RecentNewsLayout';
import RankingLayout from 'components/ranking/RankingLayout';

import { useQueries } from '@tanstack/react-query';
import { fetchVideoLists } from 'scripts/api/youtubeVideo';
import { fetchNews, fetchArticles } from 'scripts/api/news';
import { videoIds } from 'data/recommend';
import * as M from 'style/layout/MainLayout.style';

import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '../../../firebase/firebasedb';
import { useEffect } from 'react';

export default function MainLayout() {
	const queryResults = useQueries({
		queries: [
			{
				queryKey: ['youtubeVideoLists'],
				queryFn: () => fetchVideoLists(videoIds),
				staleTime: Infinity,
				gcTime: Infinity,
				refetchOnWindowFocus: false,
				refetchOnReconnect: false,
				retry: 1,
			},
			{
				queryKey: ['newsLists'],
				queryFn: async () => {
					const news = await fetchNews();
					const devArticles = await fetchArticles('http://localhost:8000/api/article/dev');
					const updateArticles = await fetchArticles('http://localhost:8000/api/article/update');

					return {
						news,
						devArticles,
						updateArticles,
					};
				},
				staleTime: 1000 * 60 * 10, // 10분
				gcTime: 1000 * 60 * 20, // 20분
			},
		],
	});

	const [
		{ data: youtubeVideo, isLoading: youtubeVideoIsLoading, isError: youtubeVideoIsError },
		{ data: newsData, isLoading: newsIsLoading, isError: newsIsError },
	] = queryResults;

	useEffect(() => {
		const fetchDocument = async () => {
			try {
				const readDoc = await getDoc(doc(firestore, '테스트', 'MRJKng2oWHJj2gFy0MrQ'));
				const readData = readDoc.data();
				console.log(readData);
			} catch (error) {
				console.error('Error fetching document:', error);
			}
		};

		fetchDocument();
	}, []);

	return (
		<>
			<M.Container>
				<RankingLayout />
				<DayoneLayout />
			</M.Container>

			<ChzzkLiveLayout />

			<RecentYoutubeLayout />

			<RecommendLayout data={youtubeVideo} isLoading={youtubeVideoIsLoading} isError={youtubeVideoIsError} />

			<RecentNewsLayout data={newsData} isLoading={newsIsLoading} isError={newsIsError} />
		</>
	);
}
