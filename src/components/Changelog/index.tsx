import * as React from 'react';
import { useRequest } from '../../hooks/useRequest';
import { Heading } from '../Heading';
import { Link } from '../Link';
import { Spinner } from '../Spinner';

const LazyMarkdown = React.lazy(async () => {
	const importedModule = await import('../../extra/Markdown');
	return {
		default: importedModule.Markdown,
	};
});

export interface ChangelogProps {
	getChangelog: () => Promise<string>;
}

const markdownComponentOverrides: React.ComponentProps<
	typeof LazyMarkdown
>['componentOverrides'] = {
	a: (props) => <Link blank {...props} />,
	h1: (props) => <Heading.h1 {...props} fontSize="20px" />,
	h2: (props) => <Heading.h2 {...props} fontSize={3} />,
	h3: (props) => <Heading.h3 {...props} fontSize={2} />,
	h4: (props) => <Heading.h4 {...props} fontSize={1} />,
};

export const Changelog = ({ getChangelog }: ChangelogProps) => {
	const [changelog, loading] = useRequest(
		async () => await getChangelog(),
		[],
		{ polling: false },
	);

	return (
		<Spinner show={loading}>
			<React.Suspense fallback={null}>
				<LazyMarkdown
					componentOverrides={markdownComponentOverrides}
					disableAutoHeadingLinking
					style={{
						maxHeight: 'calc(100vh - 260px)',
						overflowY: 'auto',
					}}
				>
					{changelog ?? ''}
				</LazyMarkdown>
			</React.Suspense>
		</Spinner>
	);
};
