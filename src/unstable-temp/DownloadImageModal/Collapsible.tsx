import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { Box } from '../../components/Box';
import { Button } from '../../components/Button';

// TODO: We should use an Accordion from rendition (which doesn't exist yet), but this will do for migrating angular to react.

interface CollapsibleProps {
	children: React.ReactElement;
	collapsible: boolean;
	initiallyCollapsed: boolean;
	title: string;
}

export const Collapsible = ({
	children,
	collapsible,
	initiallyCollapsed,
	title,
}: CollapsibleProps) => {
	const [isCollapsed, setIsCollapsed] = React.useState(initiallyCollapsed);

	if (!collapsible) {
		return <Box mb={3}>{children}</Box>;
	}

	return (
		<Box mb={3}>
			<Button
				plain
				icon={
					isCollapsed ? (
						<FontAwesomeIcon icon={faPlus} />
					) : (
						<FontAwesomeIcon icon={faMinus} />
					)
				}
				onClick={() => setIsCollapsed((x) => !x)}
			>
				{title}
			</Button>
			{!isCollapsed && <Box mt={3}>{children}</Box>}
		</Box>
	);
};
