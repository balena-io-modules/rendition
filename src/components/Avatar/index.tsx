import * as React from 'react';
import {
	Avatar as GrommetAvatar,
	AvatarProps as GrommetAvatarProps,
} from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons/faUserCircle';
import { Txt } from '../../';
import { Theme, RenditionSystemProps } from '../../common-types';
import asRendition from '../../asRendition';
import { px } from 'styled-system';

const getInitials = (firstName?: string, lastName?: string) =>
	`${firstName?.charAt(0).toUpperCase() || ''}${
		lastName?.charAt(0).toUpperCase() || ''
	}`;

const BaseAvatar = ({
	theme,
	src,
	firstName,
	lastName,
	emphasized,
	...otherProps
}: ThemedAvatarProps) => {
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
						style={{
							color: theme.colors.quartenary.dark,
							background: 'white',
						}}
						size={emphasized ? '3x' : '2x'}
						icon={faUserCircle}
					/>
				</GrommetAvatar>
			)}
		</>
	);
};

interface ThemedAvatarProps extends InternalAvatarProps {
	theme: Theme;
}

export interface InternalAvatarProps
	extends React.HTMLAttributes<HTMLElement>,
		Omit<GrommetAvatarProps, 'size'> {
	/** If defined only the first letter will be taken and shown */
	firstName?: string;
	/** If defined only the first letter will be taken and shown */
	lastName?: string;
	/** If true, uses a larger size avatar */
	emphasized?: boolean;
}

export type AvatarProps = InternalAvatarProps & RenditionSystemProps;

/** [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Avatar/Avatar.stories.tsx) */
export const Avatar = asRendition<React.FunctionComponent<AvatarProps>>(
	BaseAvatar,
);
