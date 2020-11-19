import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { Button } from '../Button';
import { ButtonGroup } from '../ButtonGroup';
import { Flex, FlexProps } from '../Flex';
import { Txt } from '../Txt';

const BasePager = ({
	totalItems,
	itemsPerPage,
	page,
	nextPage,
	prevPage,
	...props
}: PagerProps) => {
	const lowerBound = page * itemsPerPage;
	const upperBound = Math.min((page + 1) * itemsPerPage, totalItems);

	return (
		<Flex justifyContent="flex-end" alignItems="center" {...props}>
			<Txt mr={2}>
				<strong>
					{lowerBound + 1} - {upperBound}
				</strong>{' '}
				of <strong>{totalItems}</strong>
			</Txt>

			<Flex>
				<ButtonGroup>
					<Button
						quartenary
						outline
						className="rendition-pager__btn--prev"
						disabled={totalItems <= itemsPerPage || page <= 0}
						onClick={() => prevPage()}
						icon={<FontAwesomeIcon icon={faChevronLeft} />}
					/>
					<Button
						quartenary
						outline
						className="rendition-pager__btn--next"
						disabled={
							totalItems <= itemsPerPage ||
							totalItems / itemsPerPage <= page + 1
						}
						onClick={() => nextPage()}
						icon={<FontAwesomeIcon icon={faChevronRight} />}
					/>
				</ButtonGroup>
			</Flex>
		</Flex>
	);
};

export interface PagerProps extends FlexProps {
	/** The total number of items to split into pages */
	totalItems: number;
	/** The number of items on each page */
	itemsPerPage: number;
	/** The current page (zero-indexed) */
	page: number;
	/** Callback invoked when the "next page" button is clicked */
	nextPage: () => void;
	/** Callback invoked when the "previous page" button is clicked */
	prevPage: () => void;
}

/**
 * Displays a pager widget.
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Pager/Pager.stories.tsx)
 */
export const Pager = BasePager;
