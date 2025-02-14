import * as G from 'style/components/sub/encyclopedia/Grid.style';
import Image from 'next/image';
import { backgroundCondition, kartImageSrcCondition, characterImageSrcCondition } from 'data/karts';
import SCMinus from 'svg/ico-collapse-minus.svg';
import SCPlus from 'svg/ico-collapse-plus.svg';
import NoImage from 'components/sub/grid/NoImage';
import useImageLoad from 'hooks/useImageLoad';
import { publicImageSrc } from 'const';

export default function GridItem({ item, toggle, onToggle }) {
	const { loaded, imageError, handleImageError, loadingComplete } = useImageLoad();
	const itemName = item.아이템명;
	const itemNameResult = itemName.includes('A2')
		? itemName.replace('A2', '').replace(/\s/g, '')
		: itemName.replace(/\s/g, '');

	console.log(itemNameResult);

	return (
		<G.InnerItem className={`${loaded || !imageError ? 'loaded' : ''}`}>
			{item ? (
				<G.ImgDiv>
					{item.타입 && <G.Tag className={`gridTag ${backgroundCondition(item.타입)}`}>{item.타입}</G.Tag>}
					{/* <Image
						className="gridImage"
						onLoadingComplete={loadingComplete}
						onError={handleImageError}
						src={
							item.엔진
								? kartImageSrcCondition(item.엔진, itemNameResult)
								: characterImageSrcCondition(item.아이템명, itemNameResult)
						}
						width={240}
						height={200}
						alt={item.아이템명}
					/> */}
				</G.ImgDiv>
			) : (
				<NoImage width={86} height={80} src={publicImageSrc.noImage.kris} />
			)}

			{/* {imageError && <NoImage width={86} height={80} src={publicImageSrc.noImage.kris} />} */}

			<G.Box>
				<G.InnerBox>
					<G.Button className="gridButton" type="button" onClick={onToggle}>
						<G.Text>{item.아이템명}</G.Text>

						{toggle ? (
							<SCMinus width="16px" height="16px" stroke="var(--title)" />
						) : (
							<SCPlus width="16px" height="16px" stroke="var(--title)" />
						)}
					</G.Button>
				</G.InnerBox>
			</G.Box>
		</G.InnerItem>
	);
}
