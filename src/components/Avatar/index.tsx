import * as React from 'react';
import { DefaultProps } from '../../common-types';
import {
	Avatar as GrommetAvatar,
	AvatarProps as GrommetAvatarProps,
} from 'grommet';

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
					size={emphasized ? 'large' : 'medium'}
					src={src}
					{...otherProps}
				></GrommetAvatar>
			)}
			{initials && !src && (
				<GrommetAvatar size={emphasized ? 'large' : 'medium'} {...otherProps}>
					{initials}
				</GrommetAvatar>
			)}
			{!initials && !src && (
				<GrommetAvatar size={emphasized ? 'large' : 'medium'} {...otherProps} />
			)}
		</>
	);
};
