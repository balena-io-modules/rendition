import * as React from 'react';
import styled from 'styled-components';
import { Link } from '../Link';
import { Flex } from '../Flex';
import { Txt } from '../Txt';
import { useTheme } from '../../hooks/useTheme';

const Circle = styled(Flex)<{ isLast: boolean; emphasized?: boolean }>`
	border: 1px solid
		${(props) =>
			props.isLast
				? props.theme.colors.quartenary.light
				: props.theme.colors.text.light};
	border-radius: 50%;
	width: ${(props) => props.theme.space[props.emphasized ? 3 : 2]}px;
	height: ${(props) => props.theme.space[props.emphasized ? 3 : 2]}px;
	background: ${(props) =>
		props.isLast
			? props.theme.colors.quartenary.light
			: props.theme.colors.text.light};
`;

export interface Crumb {
	text: string;
	href?: string;
	icon?: React.ReactNode;
	onClick?: (event: React.MouseEvent) => void;
}

export interface BreadcrumbsProps {
	/** List of objects of type Crumb: `{text: string; icon?: React.ReactNode; onClick?: () => void;}` */
	crumbs: Crumb[];
	/** If true, use a larger Breadcrumbs */
	emphasized?: boolean;
}

const BreadcrumbContent = React.memo(
	({ icon, text }: Pick<Crumb, 'icon' | 'text'>) => {
		const crumbRef = React.useRef<HTMLDivElement>(null);
		const [shouldShowTooltip, setShouldShowTooltip] = React.useState(false);

		// On initial load we check if the text overflows, and if it does we show a tooltip, and then show the text as truncated.
		// Not the cleanest of solutions, but it works well.
		React.useEffect(() => {
			if (!crumbRef?.current) {
				return;
			}
			setShouldShowTooltip(
				crumbRef.current.scrollWidth > crumbRef.current.clientWidth,
			);
		}, []);

		return (
			<Flex ref={crumbRef} alignItems="center" width="100%">
				{icon && <Flex mr={2}>{icon}</Flex>}
				<Txt
					tooltip={shouldShowTooltip ? text : undefined}
					whitespace="nowrap"
					truncate={shouldShowTooltip}
				>
					{text}
				</Txt>
			</Flex>
		);
	},
);

export const Breadcrumbs = ({ crumbs, emphasized }: BreadcrumbsProps) => {
	const theme = useTheme();
	return (
		<Flex flexDirection="column" flexWrap="wrap" width="100%">
			{crumbs.map((crumb, i) => {
				const isLast = i === crumbs.length - 1;

				return (
					crumb && (
						<Txt
							bold={isLast}
							fontSize={2}
							color={isLast ? 'white' : 'secondary.semilight'}
							key={crumb.text}
							width="100%"
						>
							<Flex flexDirection="column" width="100%">
								<Flex alignItems="center" width="100%">
									<Circle isLast={isLast} emphasized={emphasized} />
									<Flex width={`calc(100% - ${theme.space[2]}px)`} pl={2}>
										{crumb.onClick ? (
											<Link
												style={{ display: 'inherit', color: 'inherit' }}
												onClick={crumb.onClick}
												width="100%"
												href={crumb.href}
											>
												<BreadcrumbContent
													text={crumb.text}
													icon={crumb.icon}
												/>
											</Link>
										) : (
											<BreadcrumbContent text={crumb.text} icon={crumb.icon} />
										)}
									</Flex>
								</Flex>
								{!isLast && (
									<Flex
										mt={-2}
										mb={-2}
										width={theme.space[emphasized ? 3 : 2]}
										justifyContent="center"
									>
										<Flex height={theme.space[4]} width="1px" bg="text.light" />
									</Flex>
								)}
							</Flex>
						</Txt>
					)
				);
			})}
		</Flex>
	);
};
