import * as React from 'react';
import { DefaultProps } from '../../common-types';
import {
	Avatar as GrommetAvatar,
	AvatarProps as GrommetAvatarProps,
} from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons/faUserCircle';
import { Txt } from '../../';
import { withTheme } from 'styled-components';
import { Theme } from '../../common-types';
import { px } from 'styled-system';

export interface AvatarProps
	extends DefaultProps,
		Omit<GrommetAvatarProps, 'size'> {
	theme: Theme;
	firstName?: string;
	lastName?: string;
	emphasized?: boolean;
}

const getInitials = (firstName?: string, lastName?: string) =>
	`${firstName?.charAt(0).toUpperCase() || ''}${
		lastName?.charAt(0).toUpperCase() || ''
	}`;

const AvatarBase = ({
	theme,
	src,
	firstName,
	lastName,
	emphasized,
	...otherProps
}: AvatarProps) => {
	const initials = getInitials(firstName, lastName);
	return (
		<>
			{src && (
				<GrommetAvatar
					size={emphasized ? px(theme.fontSizes[6]) : px(theme.fontSizes[5])}
					src={src}
					background={theme.colors.quartenary.dark}
					{...otherProps}
				></GrommetAvatar>
			)}
			{initials && !src && (
				<GrommetAvatar
					background={theme.colors.quartenary.dark}
					size={emphasized ? px(theme.fontSizes[6]) : px(theme.fontSizes[5])}
					{...otherProps}
				>
					<Txt color={'white'}>{initials}</Txt>
				</GrommetAvatar>
			)}
			{!initials && !src && (
				<GrommetAvatar
					background={theme.colors.quartenary.dark}
					size={emphasized ? px(theme.fontSizes[6]) : px(theme.fontSizes[5])}
					{...otherProps}
				>
					<FontAwesomeIcon
						size={emphasized ? '3x' : '2x'}
						icon={faUserCircle}
					/>
				</GrommetAvatar>
			)}
		</>
	);
};

export const Avatar = withTheme(AvatarBase);
