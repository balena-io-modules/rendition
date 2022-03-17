import React from 'react';
import styled from 'styled-components';
import { Flex, FlexProps } from '../Flex';
import { Button } from '../Button';
import { TooltipProps } from '../../common-types';
import { px } from '../../utils';

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
			border: 1px solid ${props.theme.global.control.border.color};
			width: fit-content;
			border-radius: ${props.theme.button.border.radius};
			padding: 2px;
			> button {
				padding: 2px 16px;
				border: 0px;
			}
		`
				: `
		> * {
			&:first-child {
				border-top-right-radius: 0;
				border-bottom-right-radius: 0;
				padding-left: ${px(props.theme.space[3])};
			}
	
			&:last-child {
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
				padding-right: ${px(props.theme.space[3])};
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
		const { onGroupChange, height, ...otherProps } = props;
		return (
			<ButtonGroupBase isSelect {...otherProps} alignItems="center">
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
							height={height}
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
