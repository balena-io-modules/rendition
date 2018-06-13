import * as React from 'react';
import { FaSearch } from 'react-icons/lib/fa';
import { compose } from 'recompose';
import { SearchProps } from 'rendition';
import styled, { withTheme } from 'styled-components';
import asRendition from '../asRendition';
import Theme from '../theme';

const Wrapper = styled.div`
	position: relative;
	width: 100%;
	border-bottom: 1px solid ${Theme.colors.gray.main};
	padding-left: 24px;
	padding-top: 3px;

	.search-icon {
		color: ${Theme.colors.gray.main};
		font-size: 0.9em;
		position: absolute;
		top: 50%;
		left: 4px;
		transform: translateY(-50%);
	}
	input {
		outline: none;
		background: transparent;
		box-shadow: none;
		border: none;
		width: 100%;
		font-size: inherit;
		padding: 5px 5px 8px;
		height: auto;
		&:hover {
			box-shadow: none;
		}
		::placeholder {
			color: ${Theme.colors.gray.main};
			font-weight: 300;
		}
	}
`;

const Search = ({
	dark,
	disabled,
	placeholder,
	value,
	onChange,
}: SearchProps) => {
	return (
		<Wrapper>
			<input
				style={{ color: dark ? '#fff' : undefined }}
				disabled={disabled}
				placeholder={placeholder || 'Search entries...'}
				value={value}
				onChange={onChange}
			/>
			<FaSearch className="search-icon" name="search" />
		</Wrapper>
	);
};

export default compose(withTheme, asRendition)(Search) as React.ComponentClass<
	SearchProps
>;
