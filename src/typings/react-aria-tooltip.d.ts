declare module 'react-aria-tooltip' {
	import * as React from 'react';

	interface ReactAriaTooltipProps {
		/** required */
		message: string;
		/** default 'click' */
		eventType?: 'click' | 'hover';
		/** default 'top' */
		direction?: 'top' | 'bottom' | 'right' | 'left';
		/** default 2000 */
		duration?: number;
		/** default '#000' */
		bgcolor?: string;
	}

	class ReactAriaTooltip extends React.Component<ReactAriaTooltipProps, any> {}

	export = ReactAriaTooltip;
}
