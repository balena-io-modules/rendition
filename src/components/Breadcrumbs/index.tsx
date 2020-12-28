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
	icon?: React.ReactNode;
	onClick?: () => void;
}

export interface BreadcrumbsProps {
	/** List of objects of type Crumb: `{text: string; icon?: React.ReactNode; onClick?: () => void;}` */
	crumbs: Crumb[];
	/** If true, use a larger Breadcrumbs */
	emphasized?: boolean;
}

const BreadcrumbContent = React.memo(
	({ icon, text }: Pick<Crumb, 'icon' | 'text'>) => {
		return (
			<Flex alignItems="center" justifyContent="center">
				{icon && <Flex mr={2}>{icon}</Flex>}
				<Txt truncate>{text}</Txt>
			</Flex>
		);
	},
);

export const Breadcrumbs = ({ crumbs, emphasized }: BreadcrumbsProps) => {
	const theme = useTheme();
	return (
		<Flex flexDirection="column" flexWrap="wrap">
			{crumbs.map((crumb, i) => {
				const isLast = i === crumbs.length - 1;

				return (
					crumb && (
						<Txt
							bold={isLast}
							fontSize={2}
							color={isLast ? 'white' : 'secondary.semilight'}
							key={crumb.text}
						>
							<Flex flexDirection="column">
								<Flex alignItems="center">
									<Circle isLast={isLast} emphasized={emphasized} mr={2} />
									{crumb.onClick ? (
										<Link
											style={{ display: 'inherit', color: 'inherit' }}
											onClick={crumb.onClick}
										>
											<BreadcrumbContent text={crumb.text} icon={crumb.icon} />
										</Link>
									) : (
										<Flex>
											<BreadcrumbContent text={crumb.text} icon={crumb.icon} />
										</Flex>
									)}
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
