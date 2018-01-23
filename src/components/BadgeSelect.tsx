import has = require('lodash/has');
import includes = require('lodash/includes');
import * as React from 'react';
import { BadgeSelectProps } from 'rendition';
import styled from 'styled-components';
import Badge from './Badge';
import DropDownButton from './DropDownButton';
import Text from './Text';

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

interface BadgeSelectState {
	selected: string | null | undefined;
}

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
			onItemChange,
			defaultSelected,
			placeholder,
			...props
		} = this.props;
		return (
			<DropDownButton
				{...props}
				noListFormat
				joined
				label={
					<Text>
						{this.state.selected == null &&
							!!this.props.placeholder &&
							this.props.placeholder}
						{this.state.selected == null &&
							!this.props.placeholder &&
							'Choose an option'}
						{this.state.selected != null &&
							includes(this.props.items, this.state.selected) && (
								<Badge text={this.state.selected} />
							)}
						{this.state.selected != null &&
							!includes(this.props.items, this.state.selected) &&
							this.state.selected}
					</Text>
				}
			>
				{this.props.items.map(item => (
					<ButtonWrapper key={item} onClick={() => this.setSelected(item)}>
						<Badge text={item} />
					</ButtonWrapper>
				))}

				{!!this.props.extra &&
					this.props.extra.map(item => (
						<ButtonWrapper key={item} onClick={() => this.setSelected(item)}>
							<Text>{item}</Text>
						</ButtonWrapper>
					))}
			</DropDownButton>
		);
	}
}

export default BadgeSelect;
