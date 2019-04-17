import assign = require('lodash/assign');
import * as React from 'react';
import { withProps } from 'recompose';
import styled from 'styled-components';
import asRendition from '../asRendition';
import { EnhancedType } from '../common-types';
import { monospace } from '../utils';
import { FlexProps } from './Grid';
import { align, bold, caps } from './Txt';

const Heading = styled.h3<FlexProps>`
	${align}
	${monospace as any};

	${caps as any}
	${bold as any}
`;

Heading.displayName = 'Heading';
const setDefaultProps = withProps((props: FlexProps) => {
	return assign(
		{
			fontSize: 4,
			m: 0,
		},
		props,
	);
});

const Factory = (tag?: string) => {
	return asRendition<FlexProps>(
		(props: any) => {
			return <Heading as={tag} {...props} />;
		},
		[setDefaultProps],
	);
};

const Base = Factory() as React.ComponentType<EnhancedType<FlexProps>> & {
	h1: React.ComponentType<EnhancedType<FlexProps>>;
	h2: React.ComponentType<EnhancedType<FlexProps>>;
	h3: React.ComponentType<EnhancedType<FlexProps>>;
	h4: React.ComponentType<EnhancedType<FlexProps>>;
	h5: React.ComponentType<EnhancedType<FlexProps>>;
	h6: React.ComponentType<EnhancedType<FlexProps>>;
};

Base.h1 = Factory('h1');
Base.h1.defaultProps = {
	fontSize: 6,
	m: 0,
};

Base.h2 = Factory('h2');
Base.h2.defaultProps = {
	fontSize: 5,
	m: 0,
};

Base.h3 = Factory('h3');
Base.h3.defaultProps = {
	fontSize: 4,
	m: 0,
};

Base.h4 = Factory('h4');
Base.h4.defaultProps = {
	fontSize: 3,
	m: 0,
};

Base.h5 = Factory('h5');
Base.h5.defaultProps = {
	fontSize: 2,
	m: 0,
};

Base.h6 = Factory('h6');
Base.h6.defaultProps = {
	fontSize: 1,
	m: 0,
};

export default Base;
