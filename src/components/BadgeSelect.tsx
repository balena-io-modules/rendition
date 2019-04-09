import has = require('lodash/has');
import includes = require('lodash/includes');
import * as React from 'react';
import styled from 'styled-components';
import Badge from './Badge';
import Divider from './Divider';
import DropDownButton, { DropDownButtonProps } from './DropDownButton';
import Txt from './Txt';

export interface BadgeSelectProps extends DropDownButtonProps {
	items: string[];
	extraPrefix?: string[];
	extraSuffix?: string[];
	extra?: string[];
	onItemChange?: (value: string) => void;
	defaultSelected?: string;
	placeholder?: string;
}

export interface BadgeSelectState {
	selected: string | null | undefined;
}

const ButtonWrapper = styled.button`
	border: 0;
	background: none;
	display: block;
	margin-top: 5px;
	margin-bottom: 5px;
	text-align: left;
	min-width: 182px;
	padding-left: 10px;
	padding-right: 10px;
	padding-top: 3px;
	padding-bottom: 3px;
	cursor: pointer;

	&:hover {
		background-color: #f0f3f7;
	}
`;

class BadgeSelect extends React.Component<BadgeSelectProps, BadgeSelectState> {
	constructor(props: BadgeSelectProps) {
		super(props);

		this.state = {
			selected: has(props, 'default') ? props.defaultSelected : null,
		};
	}

	setSelected(selected: string) {
		this.setState({ selected });

		if (this.props.onItemChange) {
			this.props.onItemChange(selected);
		}
	}

	render() {
		const {
			items,
			extra,
			extraPrefix,
			extraSuffix,
			onItemChange,
			defaultSelected,
			placeholder,
			color,
			...props
		} = this.props;
		return (
			<DropDownButton
				{...props}
				noListFormat
				joined
				label={
					<Txt>
						{this.state.selected == null && !!placeholder && placeholder}
						{this.state.selected == null && !placeholder && 'Choose an option'}
						{this.state.selected != null &&
							includes(items, this.state.selected) && (
								<Badge text={this.state.selected} />
							)}
						{this.state.selected != null &&
							!includes(items, this.state.selected) &&
							this.state.selected}
					</Txt>
				}
			>
				{!!extraPrefix &&
					extraPrefix.map(item => (
						<ButtonWrapper key={item} onClick={() => this.setSelected(item)}>
							<Txt fontSize={2}>{item}</Txt>
						</ButtonWrapper>
					))}

				{!!extraPrefix && <Divider height={1} color="#dadada" mx={10} />}

				{this.props.items.map(item => (
					<ButtonWrapper key={item} onClick={() => this.setSelected(item)}>
						<Badge text={item} />
					</ButtonWrapper>
				))}

				{(!!extra || extraSuffix) && (
					<Divider height={1} color="#dadada" mx={10} />
				)}

				{!!extra &&
					extra.map(item => (
						<ButtonWrapper key={item} onClick={() => this.setSelected(item)}>
							<Txt fontSize={2}>{item}</Txt>
						</ButtonWrapper>
					))}

				{!!extraSuffix &&
					extraSuffix.map(item => (
						<ButtonWrapper key={item} onClick={() => this.setSelected(item)}>
							<Txt fontSize={2}>{item}</Txt>
						</ButtonWrapper>
					))}
			</DropDownButton>
		);
	}
}

export default BadgeSelect;
