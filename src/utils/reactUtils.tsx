import * as React from 'react';

// These functions are migrated from the now deprecated recompose package.
// see https://github.com/acdlite/recompose/blob/master/src/packages/recompose/withProps.js
type mapper<TInner, TOutter> = (input: TInner) => TOutter;

// Injects props and removes them from the prop requirements.
// Will not pass through the injected props if they are passed in during
// render. Also adds new prop requirements from TNeedsProps.
type InferableComponentEnhancerWithProps<TInjectedProps, TNeedsProps> = <
	P extends TInjectedProps,
>(
	component: React.ComponentType<P>,
) => React.ComponentClass<Omit<P, keyof TInjectedProps> & TNeedsProps>;

type ComponentEnhancer<TInner, TOutter> = (
	component: React.ComponentType<TInner>,
) => React.ComponentClass<TOutter>;

// Use to compose multiple higher-order components into a single higher-order component.
export function compose<TInner, TOutter>(
	// tslint:disable-next-line ban-types
	...funcs: Function[]
): ComponentEnhancer<TInner, TOutter> {
	return funcs.reduce(
		(a, b) =>
			(...args: any[]) =>
				a(b(...args)),
		(arg: any) => arg,
	) as any;
}

// Accepts a function that merges owner props with a new collection of props
// that are then passed to the base component.
export function withProps<TInner, TOutter>(
	fn: TInner | mapper<TOutter, TInner>,
): InferableComponentEnhancerWithProps<TInner & TOutter, TOutter> {
	const wrapper = (BaseComponent: any) => {
		const hoc = (props = {}) => {
			return (
				<BaseComponent
					{...props}
					{...(typeof fn === 'function' ? (fn as any)(props) : fn)}
				/>
			);
		};

		return hoc;
	};

	return wrapper as any;
}
