import * as Tit from 'style/components/title/Title.style';

export default function MainTitle({ title, icon, right, marginBottom }) {
	return (
		<Tit.TitleBox>
			<Tit.Title icon={icon} marginBottom={marginBottom}>
				{title}
			</Tit.Title>
			{right}
		</Tit.TitleBox>
	);
}
