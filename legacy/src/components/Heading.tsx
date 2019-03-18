import { FlexProps } from 'rendition';
import styled, { StyledFunction } from 'styled-components';
import { color, fontSize, space } from 'styled-system';
import asRendition from '../asRendition';
import { monospace } from '../utils';
import { align, bold, caps } from './Txt';

const Heading = (styled.h3 as StyledFunction<FlexProps>)`
  ${align}
  ${color}
  ${fontSize}
  ${space}
  ${monospace as any};

  ${caps as any}
  ${bold as any}
`;

Heading.displayName = 'Heading';

Heading.defaultProps = {
	fontSize: 4,
	m: 0,
};

const Base = asRendition(Heading) as React.ComponentClass<FlexProps> & {
	h1: React.ComponentClass<FlexProps>;
	h2: React.ComponentClass<FlexProps>;
	h3: React.ComponentClass<FlexProps>;
	h4: React.ComponentClass<FlexProps>;
	h5: React.ComponentClass<FlexProps>;
	h6: React.ComponentClass<FlexProps>;
};

Base.h1 = asRendition(Heading.withComponent('h1'));
Base.h1.defaultProps = {
	fontSize: 6,
	m: 0,
};

Base.h2 = asRendition(Heading.withComponent('h2'));
Base.h2.defaultProps = {
	fontSize: 5,
	m: 0,
};

Base.h3 = asRendition(Heading.withComponent('h3'));
Base.h3.defaultProps = {
	fontSize: 4,
	m: 0,
};

Base.h4 = asRendition(Heading.withComponent('h4'));
Base.h4.defaultProps = {
	fontSize: 3,
	m: 0,
};

Base.h5 = asRendition(Heading.withComponent('h5'));
Base.h5.defaultProps = {
	fontSize: 2,
	m: 0,
};

Base.h6 = asRendition(Heading.withComponent('h6'));
Base.h6.defaultProps = {
	fontSize: 1,
	m: 0,
};

export default Base;
