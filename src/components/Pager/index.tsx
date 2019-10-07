import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import Button from '../Button';
import ButtonGroup from '../ButtonGroup';
import { Flex, FlexProps } from '../Flex';
import Txt from '../Txt';

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
	totalItems: number;
	itemsPerPage: number;
	page: number;
	nextPage: () => void;
	prevPage: () => void;
}

export default Pager;
