import * as S from 'style/components/sub/common/Sidebar.style';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function DetailsItem({ commonProps, depth1, depth1Key, depthType, value }) {
	const pathname = usePathname();
	const [isActive, setIsActive] = useState('');
	const [detailOpen, setDetailOpen] = useState(false);

	const myHref = depth1 && depth1.depth2?.map(depth2 => depth2.href);

	if (commonProps.dataType === 'sidebar') {
		useEffect(() => {
			if (!isActive && myHref?.includes(pathname)) {
				setIsActive('active');
			}
		}, [pathname, isActive]);

		useEffect(() => {
			if (isActive === 'active' || value.length > 0) {
				setDetailOpen(true);
			} else {
				setDetailOpen(false);
			}
		}, [isActive, value]);
	}

	const renderItem = (depthType, depth1, depth1Key) => {
		if (depthType === 'noDepth') {
			const hrefActive = depth1.href === pathname ? 'active' : '';
			const isHighlighted = value.length > 0 ? 'highlight' : '';

			return (
				<S.DetailsOuterItem className={`${hrefActive}`} noDepth key={depth1Key}>
					<Link className={`detailsLink highlightText ${isHighlighted}`} href={depth1.href}>
						{depth1.title}
					</Link>
				</S.DetailsOuterItem>
			);
		}

		if (depthType === 'hasDepth') {
			return (
				<S.DetailsOuterItem key={depth1Key}>
					<S.Details open={detailOpen}>
						<S.Summary>
							<span className={`highlightText ${value.length > 0 ? 'highlight' : ''}`}>{depth1.title}</span>
						</S.Summary>
						<S.List>
							{depth1.depth2.map((depth2, depth2Index) => {
								const hrefActive = depth2.href === pathname ? 'active' : '';
								const isHighlighted = value.length > 0 && depth2.title.toLowerCase().includes(value.toLowerCase());

								return (
									<S.Item className={`${hrefActive} `} key={depth2Index}>
										<Link className={`highlightText ${isHighlighted ? 'highlight' : ''}`} href={depth2.href}>
											{depth2.title}
										</Link>
									</S.Item>
								);
							})}
						</S.List>
					</S.Details>
				</S.DetailsOuterItem>
			);
		}
	};

	return <>{renderItem(depthType, depth1, depth1Key)}</>;
}
