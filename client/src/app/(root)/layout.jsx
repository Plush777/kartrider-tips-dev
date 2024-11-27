import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';
import { cookies } from 'next/headers';

export default function MainLayout({ children }) {
	const cookieStore = cookies();

	/*
    cookies: {name: cookie이름 , value: cookie 값} 형식으로 저장됨.
  */
	const serverStates = {
		theme: cookieStore.get('theme'),
		fontSize: cookieStore.get('fontSize'),
	};

	console.log(serverStates.theme);
	console.log(serverStates.fontSize);

	return (
		<>
			<Header serverStates={serverStates} />
			{children}
			<Footer />
		</>
	);
}
