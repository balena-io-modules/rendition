import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import range from 'lodash/range';
import React from 'react';
import { Box } from '../Box';
import { Flex, FlexProps } from '../Flex';
import { ProgressBar, ProgressBarProps } from '../ProgressBar';
import { Txt } from '../Txt';

export type LabelFormatterProp = (props: {
	value: number;
	max: number | null;
}) => React.ReactElement | string;

export interface StatsBarProps extends Omit<FlexProps, 'title'> {
	title: React.ReactElement;
	labelFormatter?: LabelFormatterProp;
	value: number;
	max: number | null;
	numSlices?: number;
}

export interface StatsTitleProps {
	icon: IconProp;
	title: string;
	description?: string;
}

interface DiscreteBarProps extends ProgressBarProps {
	numSlices: number;
}

export interface ValueWithMaxTitleProps {
	value: string;
	max: string;
}

export const ValueWithMaxTitle = ({ value, max }: ValueWithMaxTitleProps) => (
	<>
		<Txt.span>{value}</Txt.span>/
		<Txt.span color="tertiary.main">{max}</Txt.span>
	</>
);

const getDiscreteBarValue = (
	value: number,
	numSlices: number,
	index: number,
) => {
	const highlightedNumSlices = Math.ceil(value / (100 / numSlices));
	if (numSlices <= 1) {
		return value;
	}

	return highlightedNumSlices > index ? 100 : 0;
};

const DiscreteBar = ({ value, numSlices, ...props }: DiscreteBarProps) => {
	return (
		<Flex flexDirection="row">
			{range(numSlices).map((idx) => (
				<Box flex={1} mr={idx === numSlices - 1 ? 0 : 2}>
					<ProgressBar
						value={getDiscreteBarValue(value, numSlices, idx)}
						{...props}
					/>
				</Box>
			))}
		</Flex>
	);
};

export const StatsTitle = ({ icon, title, description }: StatsTitleProps) => {
	return (
		<Flex
			flexDirection="column"
			alignItems="flex-start"
			justifyContent="flex-start"
		>
			<Box>
				<Txt.span mr={1} color="tertiary.semilight">
					<FontAwesomeIcon icon={icon} />
				</Txt.span>
				<Txt.span>{title}</Txt.span>
			</Box>
			{/* We add a zero-width character so the span always keeps its size */}
			<Txt.span color="tertiary.main" style={{ lineHeight: 1 }} fontSize={0}>
				{description || '\u200b'}
			</Txt.span>
		</Flex>
	);
};

export const StatsBar = ({
	title,
	labelFormatter,
	value,
	max,
	numSlices,
	...props
}: StatsBarProps) => {
	const percentage = (value / (max ?? 100)) * 100;
	// ProgressBar checks for the existence of a field rather than checking for true/false, so we have to do it this way.
	const bg = {
		...(percentage <= 60 ? { success: true } : {}),
		...(percentage > 60 && percentage <= 80 ? { warning: true } : {}),
		...(percentage > 80 ? { danger: true } : {}),
	};

	return (
		<Flex flex={1} minWidth={152} flexDirection="column" {...props}>
			<Flex
				mb={2}
				flexDirection="row"
				alignItems="flex-start"
				justifyContent="space-between"
			>
				<Txt.span>{title}</Txt.span>
				<Txt.span>
					{labelFormatter ? labelFormatter({ value, max }) : value}
				</Txt.span>
			</Flex>
			<DiscreteBar numSlices={numSlices ?? 1} value={percentage} {...bg} />
		</Flex>
	);
};
