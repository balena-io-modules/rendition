import * as React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/lib/fa';
import { PagerProps } from 'rendition';
import styled from 'styled-components';
import Button from './Button';
import { Box, Flex } from './Grid';
import Txt from './Txt';

const ButtonGroup = styled(Box)`
	padding-right: 1px;

	> button {
		margin-right: -1px;

		&:first-child {
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}

		+ button {
			border-radius: 0;
		}

		&:last-child {
			border-top-right-radius: 3px;
			border-bottom-right-radius: 3px;
		}
	}
`;

export default ({
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
		<Flex justify="flex-end" align="center" {...props}>
			<Txt mr={2}>
				<strong>
					{lowerBound + 1} - {upperBound}
				</strong>{' '}
				of <strong>{totalItems}</strong>
			</Txt>

			<Flex>
				<ButtonGroup>
					<Button
						className="rendition-pager__btn--prev"
						square
						disabled={totalItems <= itemsPerPage || page <= 0}
						onClick={() => prevPage()}
					>
						<FaChevronLeft />
					</Button>
					<Button
						className="rendition-pager__btn--next"
						square
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
