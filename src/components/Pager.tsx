import * as React from 'react';
import FaChevronLeft = require('react-icons/lib/fa/chevron-left');
import FaChevronRight = require('react-icons/lib/fa/chevron-right');
import { ButtonGroup } from '../';
import Button from './Button';
import { Flex, FlexProps } from './Grid';
import Txt from './Txt';

const Pager = ({
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
						px={11}
						className="rendition-pager__btn--prev"
						disabled={totalItems <= itemsPerPage || page <= 0}
						onClick={() => prevPage()}
					>
						<FaChevronLeft />
					</Button>
					<Button
						px={11}
						className="rendition-pager__btn--next"
						disabled={
							totalItems <= itemsPerPage ||
							totalItems / itemsPerPage <= page + 1
						}
						onClick={() => nextPage()}
					>
						<FaChevronRight />
					</Button>
				</ButtonGroup>
			</Flex>
		</Flex>
	);
};

export interface PagerProps extends FlexProps {
	totalItems: number;
	itemsPerPage: number;
	page: number;
	nextPage: () => void;
	prevPage: () => void;
}

export default Pager;
