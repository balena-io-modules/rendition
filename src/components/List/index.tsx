import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import { RenditionSystemProps } from '../../common-types';

// We use `em` so the list item size scales with the font size used.
const ORDERED_LIST_SIZE = 1.5;

const ListBase = styled.ul`
	padding: 0;
	margin: 0;
	list-style: none;

	& > li {
		display: flex;

		:first-child {
			margin-top: 0;
		}

		:last-child {
			margin-bottom: 0;
		}

		:before {
			text-align: center;
		}
	}
`;

const OrderedList = styled(ListBase).attrs({ as: 'ol' })`
	counter-reset: ordered-list-counter;

	& > li {
		margin: ${props => props.theme.space[3]}px 0;
		counter-increment: ordered-list-counter;

		:before {
			content: counter(ordered-list-counter);
			margin-right: ${props => props.theme.space[2]}px;
			background: ${props => props.theme.colors.info.main};
			height: ${ORDERED_LIST_SIZE}em;
			width: ${ORDERED_LIST_SIZE}em;
			min-width: ${ORDERED_LIST_SIZE}em;
			line-height: ${ORDERED_LIST_SIZE}em;
			color: white;
			border-radius: 50%;
		}
	}
`;

const UnorderedList = styled(ListBase)`
	& > li {
		margin: ${props => props.theme.space[1]}px 0;

		:before {
			content: '\\2022'; /* Unicode for a bullet character */
			margin-right: ${props => props.theme.space[2]}px;
			transform: translateY(
				-1px
			); /* The bullet character is misplaced (by design it seems) by 1px, but it looks better if it is centered */
			color: ${props => props.theme.colors.tertiary.main};
		}
	}
`;

const List = ({ children, className, ordered }: InternalListProps) => {
	const ListType = ordered ? OrderedList : UnorderedList;
	return (
		<ListType className={className}>
			{React.Children.map(children, child => {
				return <li>{child}</li>;
			})}
		</ListType>
	);
};

interface InternalListProps {
	children: React.ReactNode;
	className?: string;
	ordered?: boolean;
}

export type ListProps = InternalListProps & RenditionSystemProps;
export default asRendition<React.FunctionComponent<ListProps>>(List);
