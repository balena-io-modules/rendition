import debounce from 'lodash/debounce';
import * as React from 'react';
import { BreakpointContext } from '../../contexts/BreakpointContext';
export interface BreakpointProviderProps {
	breakpoints: number[];
	onBreakpointChange?: (breakpoint: number) => void;
}

export const BreakpointProvider: React.FC<BreakpointProviderProps> = ({
	breakpoints,
	children,
}) => {
	const [currentBreakpoint, setCurrentBreakpoint] = React.useState<number>(0);

	React.useEffect(() => {
		if (!breakpoints || !breakpoints.length) {
			return;
		}

		const handleResize = () => {
			const clientWidth = window.innerWidth;
			const breakpointIndex = breakpoints.findIndex(
				(breakpoint) => clientWidth < breakpoint,
			);
			const currentBreakpoint =
				breakpointIndex >= 0 ? breakpointIndex : breakpoints.length - 1;
			setCurrentBreakpoint(currentBreakpoint);
		};

		const debouncedResize = debounce(handleResize, 80);

		handleResize();

		window.addEventListener('resize', debouncedResize, { passive: false });

		return () => {
			window.removeEventListener('resize', debouncedResize);
		};
	}, [breakpoints]);

	return (
		<BreakpointContext.Provider value={{ currentBreakpoint }}>
			{children}
		</BreakpointContext.Provider>
	);
};

BreakpointProvider.displayName = 'BreakpointProvider';
