import * as React from 'react';
import { Changelog, ChangelogProps } from '.';
import { Modal } from '../Modal';

export const ChangelogModal = ({
	onDone,
	getChangelog,
}: ChangelogProps & {
	onDone: () => void;
}) => {
	return (
		<Modal title="Changelog" done={onDone} action={'Close'}>
			<Changelog getChangelog={getChangelog} />
		</Modal>
	);
};
