import * as React from 'react';
import { DefaultProps } from '../../common-types';
import {
	Avatar as GrommetAvatar,
	AvatarProps as GrommetAvatarProps,
} from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons/faUserCircle';
import { Txt } from '../../';

export interface AvatarProps
	extends DefaultProps,
		Omit<GrommetAvatarProps, 'size'> {
	firstName?: string;
	lastName?: string;
	emphasized?: boolean;
}

const getInitials = (firstName?: string, lastName?: string) =>
	`${firstName?.charAt(0).toUpperCase() || ''}${
		lastName?.charAt(0).toUpperCase() || ''
	}`;

export const Avatar = ({
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
					size={emphasized ? '36px' : '24px'}
					src={src}
					{...otherProps}
				></GrommetAvatar>
			)}
			{initials && !src && (
				<GrommetAvatar size={emphasized ? '36px' : '24px'} {...otherProps}>
					<Txt>{initials}</Txt>
				</GrommetAvatar>
			)}
			{!initials && !src && (
				<GrommetAvatar size={emphasized ? '36px' : '24px'} {...otherProps}>
					<FontAwesomeIcon
						size={emphasized ? '3x' : '2x'}
						icon={faUserCircle}
					/>
				</GrommetAvatar>
			)}
		</>
	);
};
