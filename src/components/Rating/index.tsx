import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons/faStar';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons/faStar';
import {
	FontAwesomeIcon,
	FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import * as React from 'react';
import range from 'lodash/range';
import isNumber from 'lodash/isNumber';
import asRendition from '../../asRendition';
import { RenditionSystemProps } from '../../common-types';
import { useTheme } from '../../hooks/useTheme';
import { Flex } from '../Flex';

interface StarProps extends Omit<FontAwesomeIconProps, 'icon' | 'color'> {
	full: boolean;
}

const Star = ({ full, ...rest }: StarProps) => {
	const theme = useTheme();

	const iconProps = full
		? {
				color: theme.rating.star.color.full,
				icon: faStarSolid,
		  }
		: {
				color: theme.rating.star.color.empty,
				icon: faStarRegular,
		  };

	return <FontAwesomeIcon {...iconProps} {...rest} />;
};

const isStarFull = (hoverValue: number, newValue: number, value: number) => {
	if (hoverValue > 0) {
		return newValue <= hoverValue;
	}

	return isNumber(value) && newValue <= value;
};

interface InternalRatingProps {
	children?: React.ComponentType;
	value: number;
	onChange: (newValue: number) => any;
}

const BaseRating = React.memo(
	({ value, onChange, ...rest }: InternalRatingProps) => {
		const [hoverValue, setHoverValue] = React.useState(0);

		return (
			<Flex {...rest}>
				{range(1, 6).map((newValue) => {
					return (
						<Star
							key={newValue}
							full={isStarFull(hoverValue, newValue, value)}
							onClick={() => onChange(newValue)}
							onMouseOver={() => setHoverValue(newValue)}
							onMouseOut={() => setHoverValue(0)}
						/>
					);
				})}
			</Flex>
		);
	},
);

export type RatingProps = InternalRatingProps & RenditionSystemProps;

/** [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Rating/Rating.stories.tsx) */
export const Rating = asRendition<React.FunctionComponent<RatingProps>>(
	BaseRating,
);
