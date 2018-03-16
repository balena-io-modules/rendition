import * as React from 'react';
import ReactAriaTooltip from 'react-aria-tooltip';
import { compose } from 'recompose';
import { TooltipProps } from 'rendition';
import styled, { withTheme } from 'styled-components';
import hoc from '../hoc';
import { px } from '../utils';

const Base = (props: TooltipProps) => {
	const { message, ...innerProps } = props;

	if (!innerProps.eventType) {
		innerProps.eventType = 'hover';
	}

	return <ReactAriaTooltip message={message || ''} {...innerProps} />;
};

const Tooltip = styled(Base)`
	.ra-tooltip {
		border-radius: ${props => px(props.theme.radius)};

		p {
			padding: 3px 8px;
			font-size: 12px;
		}
	}

	&.ra-tooltip-wrapper.active > .ra-tooltip {
		${props => (!props.message ? 'display: none;' : '')};
	}
`;

export default compose<{}, TooltipProps>(withTheme, hoc)(Tooltip);
