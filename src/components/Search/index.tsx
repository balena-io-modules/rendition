import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import { RenditionSystemProps } from '../../common-types';
import { px } from '../../utils';
import { Flex } from '../Flex';
import { Button } from '../Button';
import { Keyboard } from 'grommet';

const Wrapper = styled(Flex)`
	position: relative;
	width: 100%;
	border-bottom: 1px solid ${(props) => props.theme.colors.quartenary.main};
	padding-left: 24px;
	padding-top: 4px;

	.search-icon {
		color: ${(props) => props.theme.colors.tertiary.semilight};
		position: absolute;
		top: 50%;
		left: ${(props) => px(props.theme.space[2])};
		transform: translateY(-50%);
	}
	.clear-icon {
		color: ${(props) => props.theme.colors.tertiary.semilight};
		position: absolute;
		top: 50%;
		right: ${(props) => px(props.theme.space[2])};
		transform: translateY(-50%);
	}
	input {
		outline: none;
		background: transparent;
		box-shadow: none;
		border: none;
		width: 100%;
		font-size: inherit;
		padding: 4px;
		height: auto;
		font-family: ${(props) => props.theme.font};

		&:hover {
			box-shadow: none;
		}
		::placeholder {
			color: ${(props) => props.theme.colors.tertiary.semilight};
			font-family: ${(props) => props.theme.font};
		}
	}
`;

const BaseSearch: React.ForwardRefExoticComponent<SearchProps> =
	React.forwardRef(
		(
			{
				className,
				dark,
				disabled,
				placeholder,
				value,
				onChange,
				onEnter,
			}: InternalSearchProps,
			ref,
		) => {
			return (
				<Wrapper className={className}>
					<Keyboard onEnter={onEnter}>
						<input
							style={{ color: dark ? '#fff' : undefined }}
							disabled={disabled}
							placeholder={placeholder || 'Search entries...'}
							value={value}
							onChange={onChange}
							ref={ref as any}
						/>
					</Keyboard>
					<FontAwesomeIcon icon={faSearch} className="search-icon" />
					{!!value && (
						<Button
							plain
							className="clear-icon"
							onClick={() => {
								if (onChange) {
									onChange({ target: { value: '' } });
								}
							}}
						>
							<FontAwesomeIcon icon={faTimes} />
						</Button>
					)}
				</Wrapper>
			);
		},
	);

export interface InternalSearchProps extends React.HTMLAttributes<HTMLElement> {
	/** If true, uses a light colorscheme for use on a dark background */
	dark?: boolean;
	/** If true, disable the input */
	disabled?: boolean;
	/** A placeholder to use in the input */
	placeholder?: string;
	/** The value of the input */
	value?: string;
	/** A function that is called when the input changes */
	onChange?: (value: any) => void;
	onEnter?: () => void;
}

export type SearchProps = InternalSearchProps & RenditionSystemProps;

/**
 * Displays an input styled as a search bar.
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Search/Search.stories.tsx)
 */
export const Search =
	asRendition<
		React.ForwardRefExoticComponent<
			SearchProps & React.RefAttributes<HTMLInputElement>
		>
	>(BaseSearch);
