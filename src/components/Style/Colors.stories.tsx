import { Meta } from '@storybook/react';
import React from 'react';
import { createStory, createTemplate } from '../../stories/utils';
import Theme from '../../theme';
import { Flex } from '../Flex';
import { Heading } from '../Heading';
import { Txt } from '../Txt';

export default {
	title: 'Styles/Colors',
} as Meta;

const getContrast = (hexColor: string) => {
	const r = parseInt(hexColor.substr(1, 2), 16);
	const g = parseInt(hexColor.substr(3, 2), 16);
	const b = parseInt(hexColor.substr(5, 2), 16);
	const colorSpace = (r * 299 + g * 587 + b * 114) / 1000;
	return colorSpace >= 128 ? 'black' : 'white';
};

const SwatchesComponent = () => {
	return (
		<Flex flexWrap="wrap">
			{Object.entries(Theme.colors).map(([key, value]) => (
				<Flex flexDirection="column" mr={5} mb={3}>
					<Heading.h4 bold>{key}</Heading.h4>
					<Flex>
						{Object.entries(value).map(([colorKey, colorValue]) => (
							<Flex
								width="100px"
								height="100px"
								bg={colorValue}
								alignItems="center"
								justifyContent="center"
							>
								<Txt color={getContrast(colorValue)}>{colorKey}</Txt>
							</Flex>
						))}
					</Flex>
				</Flex>
			))}
		</Flex>
	);
};

const Template = createTemplate<any>(SwatchesComponent);

export const Default = createStory<any>(Template, {});
