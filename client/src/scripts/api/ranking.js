import axios from 'axios';

export const fetchGameData = async ({ pageParam }) => {
	const start = pageParam;
	const { data } = await axios.get(`http://localhost:8000/api/games/ranking?rankingCursor=${start}`);

	return data;
};

export const fetchDayoneData = async ({ pageParam }) => {
	const start = pageParam;
	const { data } = await axios.get(`http://localhost:8000/api/games/dayone?dayoneCursor=${start}`);

	return data;
};
