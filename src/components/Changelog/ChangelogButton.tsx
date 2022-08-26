import * as React from 'react';
import { Button, ButtonProps } from '../Button';
import { Flex } from '../Flex';
import { Txt } from '../Txt';
import styled from 'styled-components';
import * as semver from 'semver';
import { ChangelogProps } from '.';
import { ChangelogModal } from './ChangelogModal';
import { getFromLocalStorage, setToLocalStorage } from '../../utils';

const LAST_VIEWED_CHANGELOG_VERSION_STORAGE_KEY =
	'last-viewed-changelog-version';

const NotificationBubble = styled.div`
	${(props) => `
		background-color: ${props.theme.colors.primary.main};
	`}
	border-radius: 50%;
	padding: 5px;
	position: absolute;
`;

export const ChangelogButton = ({
	getChangelog,
	latestChangelogVersion,
	onClick,
	style,
	...restProps
}: ChangelogProps &
	ButtonProps & {
		latestChangelogVersion?: string;
	}) => {
	const [showChangelogModal, setShowChangelogModal] = React.useState(false);
	const lastViewedChangelogVersion = React.useMemo(
		() =>
			getFromLocalStorage<string | undefined>(
				LAST_VIEWED_CHANGELOG_VERSION_STORAGE_KEY,
			),
		[showChangelogModal],
	);

	return (
		<Flex justifyContent="flex-end">
			<Button
				color="quartenary.main"
				onClick={(e) => {
					onClick?.(e);
					setShowChangelogModal(true);
					setToLocalStorage(
						LAST_VIEWED_CHANGELOG_VERSION_STORAGE_KEY,
						latestChangelogVersion,
					);
				}}
				style={{
					background: 'rgba(0, 0, 0, 0.1)',
					borderRadius: '2px',
					lineHeight: 1.1,
					...style,
				}}
				{...restProps}
			>
				<Flex flexDirection="column">
					<Txt>Changelog</Txt>
					{latestChangelogVersion && <Txt>v{latestChangelogVersion}</Txt>}
				</Flex>
			</Button>
			{lastViewedChangelogVersion &&
				latestChangelogVersion &&
				semver.lt(lastViewedChangelogVersion, latestChangelogVersion) && (
					<NotificationBubble />
				)}
			{showChangelogModal && (
				<ChangelogModal
					onDone={() => setShowChangelogModal(false)}
					getChangelog={getChangelog}
				/>
			)}
		</Flex>
	);
};
