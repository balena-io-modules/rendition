import React from 'react';
import styled from 'styled-components';
import { Flex, FlexProps } from '../Flex';
import { Button } from '../Button';
import { TooltipProps } from '../../common-types';

export type OptionType = ButtonGroupOption | string | number | boolean;
export interface ButtonGroupOption {
	label: string | number;
	value: unknown;
	tooltip?: string | TooltipProps;
}
export interface ButtonGroupWithOptionsProps
	extends Omit<FlexProps, 'children'> {
	options: OptionType[];
	value?: OptionType;
	onGroupChange: (value: OptionType) => void;
}

export type ButtonGroupProps = FlexProps | ButtonGroupWithOptionsProps;

/**
 * Wrapper for buttons to make them stick together.
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/ButtonGroup/ButtonGroup.stories.tsx)
 */
const ButtonGroupBase = styled(Flex)<{ isSelect?: boolean }>`
		${(props) =>
			props.isSelect
				? `
			border: 1px solid black;
			width: fit-content;
			border-radius: ${props.theme.button.border.radius};
			padding: 2px;
			> * {
				padding: 2px 16px;
				border: 0px;
				&:not(:first-child) {
					margin-left: ${props.theme.space[1]};
				}
			}
		`
				: `
		> * {
			&:first-child {
				border-top-right-radius: 0;
				border-bottom-right-radius: 0;
			}
	
			&:last-child {
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
			}
	
			&:not(:last-child) {
				border-right: 0;
			}
	
			&:not(:last-child):not(:first-child) {
				border-radius: 0;
			}
	
			&:hover {
				z-index: 1;
			}
		`}
	}
`;

export const ButtonGroup = (props: ButtonGroupProps) => {
	if ('options' in props) {
		const { onGroupChange, ...otherProps } = props;
		return (
			<ButtonGroupBase isSelect {...otherProps}>
				{props.options.map((option) => {
					const label = typeof option !== 'object' ? option : option.label;
					return (
						<Button
							active={
								typeof option !== 'object'
									? option === props.value
									: option.value === props.value
							}
							tooltip={typeof option === 'object' ? option.tooltip : undefined}
							onClick={() => {
								if (onGroupChange) {
									onGroupChange(option);
								}
							}}
						>
							{label}
						</Button>
					);
				})}
			</ButtonGroupBase>
		);
	}

	if ('children' in props) {
		return <ButtonGroupBase {...props}>{props.children}</ButtonGroupBase>;
	}

	return null;
};
