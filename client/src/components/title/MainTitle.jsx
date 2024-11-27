import * as Tit from 'style/components/title/Title.style';

export default function MainTitle({ title, icon, right, marginBottom }) {
	return (
		<Tit.TitleBox icon={icon}>
			<Tit.Title icon={icon}>{title}</Tit.Title>
			{right}
		</Tit.TitleBox>
	);
}
