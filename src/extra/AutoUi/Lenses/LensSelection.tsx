import React from 'react';
import { Box } from '../../../components/Box';
import { Button } from '../../../components/Button';
import { ButtonGroup } from '../../../components/ButtonGroup';
import { LensTemplate } from './';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import map from 'lodash/map';
import get from 'lodash/get';

// HACK: set min height to the height of a button group
// this prevents the component collapsing vertically if
// there are no lenses provided.
const MIN_HEIGHT = '38px';

interface LensSelectionProps {
	lenses: LensTemplate[];
	lens: LensTemplate;
	setLens: (lens: LensTemplate) => void;
	rest?: any;
}

export const LensSelection = ({
	lenses,
	lens,
	setLens,
	...rest
}: LensSelectionProps) => {
	return (
		<Box {...rest} minHeight={MIN_HEIGHT}>
			{lenses.length > 1 && (
				<ButtonGroup>
					{map(lenses, (item) => {
						return (
							<Button
								key={item.slug}
								active={lens && lens.slug === item.slug}
								data-test={`lens-selector--${item.slug}`}
								data-slug={item.slug}
								onClick={() => setLens(item)}
								pt={11}
								tooltip={{
									text: get(item, ['data', 'label'], ''),
									placement: 'bottom',
								}}
								icon={<FontAwesomeIcon icon={item.data.icon} />}
							/>
						);
					})}
				</ButtonGroup>
			)}
		</Box>
	);
};
