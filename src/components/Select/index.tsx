import {
	Select as GrommetSelect,
	SelectProps as GrommetSelectProps,
} from 'grommet';
import * as React from 'react';
import styled from 'styled-components';

import asRendition from '../../asRendition';
import { DefaultProps, Omit, RenditionSystemProps } from '../../common-types';
import { px } from '../../utils';

type AdjustedGrommetSelectProps = Omit<
	GrommetSelectProps,
	'onChange' | 'children'
>;

const StyledGrommetSelect = styled(GrommetSelect as React.ComponentClass<
	AdjustedGrommetSelectProps,
	any
>)<InternalSelectProps<any>>`
	font-family: ${props => props.theme.font};
	font-size: ${props => px(props.theme.fontSizes[1])};
	font-weight: normal;
	/* The wrapping button component has borders of 1px, and changing it's height messes up the drop alignment, so we subtract the border width on the input */
	height: ${props =>
		px((props.emphasized ? props.theme.space[5] : props.theme.space[4]) - 2)};
	padding: ${props => (props.emphasized ? '14px' : '10px')};
	padding-left: 20px;
`;

// Set button to occupy parent's width, and a default width.
const Container = styled.div`
	& > button {
		width: 100%;
	}
`;

// TODO: Remove the border and radius when the drop is open (it can open either on bottom or top, so it should be handled in Grommet)
// Issue in grommet: https://github.com/grommet/grommet/issues/3156

// TODO: Make the select borders darker when the Select is open. Opened an issue in grommet: https://github.com/grommet/grommet/issues/3157
function Select<T>({
	size,
	selected,
	focusIndicator,
	margin,
	className,
	dropProps,
	...otherProps
}: InternalSelectProps<T>) {
	return (
		// Rendition system props should be applied to the wrapper, otherwise it is applied to the input tag of the Select component.
		<Container className={className}>
			<StyledGrommetSelect
				{...otherProps}
				dropProps={{ ...dropProps, elevation: 'none' }}
				focusIndicator={false}
			/>
		</Container>
	);
}

interface InternalSelectProps<T>
	extends AdjustedGrommetSelectProps,
		Omit<DefaultProps, 'onChange'> {
	emphasized?: boolean;
	onChange: (data: {
		option: T;
		selected: number;
		target: React.ChangeEvent<HTMLElement>;
		value: T;
	}) => void;
	children?: (
		option: T,
		index: number,
		options: T[],
		state: { active: boolean; disabled: boolean; selected: boolean },
	) => void;
}

// Some of the props in Grommet are undesired or deprecated.
export interface SelectProps<T>
	extends Omit<
			InternalSelectProps<T>,
			'size' | 'selected' | 'focusIndicator' | 'margin'
		>,
		RenditionSystemProps {}

export default asRendition<
	<T extends {}>(props: SelectProps<T>) => JSX.Element
>(Select);
