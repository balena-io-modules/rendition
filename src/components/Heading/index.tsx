import * as React from 'react';
import { withProps } from 'recompose';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import { RenditionSystemProps } from '../../common-types';
import { monospace } from '../../utils';
import { FlexProps } from '../Flex';
import { align, bold, caps } from '../Txt';

const BaseHeading = styled.h3<InternalHeadingProps>`
	font-weight: normal;
	${align}
	${monospace};
	${caps}
	${bold}
`;

BaseHeading.displayName = 'Heading';
const setDefaultProps = withProps((props: FlexProps) => {
	return Object.assign(
		{
			fontSize: 4,
			m: 0,
			bold: false,
		},
		props,
	);
});

const Factory = (tag?: string) => {
	return asRendition<React.FunctionComponent<InternalHeadingProps>>(
		(props: InternalHeadingProps) => {
			// Styled components v4 typing for `as` is not properly typed yet, so it needs to be ignored. https://github.com/DefinitelyTyped/DefinitelyTyped/blob/03186dbc08372aa1ca9689147386523588be6efd/types/styled-components/index.d.ts#L186
			// @ts-ignore
			return <BaseHeading as={tag} {...props} />;
		},
		[setDefaultProps],
	);
};

interface InternalHeadingProps extends React.HTMLAttributes<HTMLElement> {
	align?: string;
	monospace?: boolean;
	caps?: boolean;
	bold?: boolean;
}

export type HeadingProps = InternalHeadingProps & RenditionSystemProps;

const Base = Factory() as React.FunctionComponent<HeadingProps> & {
	h1: React.FunctionComponent<HeadingProps>;
	h2: React.FunctionComponent<HeadingProps>;
	h3: React.FunctionComponent<HeadingProps>;
	h4: React.FunctionComponent<HeadingProps>;
	h5: React.FunctionComponent<HeadingProps>;
	h6: React.FunctionComponent<HeadingProps>;
};

Base.h1 = Factory('h1');
Base.h1.defaultProps = {
	fontSize: 7,
	m: 0,
};

Base.h2 = Factory('h2');
Base.h2.defaultProps = {
	fontSize: 6,
	m: 0,
};

Base.h3 = Factory('h3');
Base.h3.defaultProps = {
	fontSize: 5,
	m: 0,
};

Base.h4 = Factory('h4');
Base.h4.defaultProps = {
	fontSize: 4,
	m: 0,
	bold: true,
};

Base.h5 = Factory('h5');
Base.h5.defaultProps = {
	fontSize: 3,
	m: 0,
	bold: true,
};

Base.h6 = Factory('h6');
Base.h6.defaultProps = {
	fontSize: 2,
	m: 0,
	bold: true,
};

/**
 * A component that displays a heading. By default an `<h3>` tag is used. The exact heading type can be specifed by appending the element name to the component, for example `<Heading.h1>`, `<Heading.h2>`, `<Heading.h3>` etc.
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Heading/Heading.stories.tsx)
 */
export const Heading = Base;
