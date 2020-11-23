import * as React from 'react';

// Load given React component asynchronously, needed when implementing WASM
// This component can be replaced with React.lazy once we upgrade to React v16.6
// https://reactjs.org/blog/2018/10/23/react-v-16-6.html#reactlazy-code-splitting-with-suspense
export const Async = (importComponent: () => any) => {
	return class extends React.Component {
		public displayName = importComponent;

		public state = {
			component: null,
		};

		public componentDidMount() {
			importComponent().then((cmp: any) => {
				this.setState({ component: cmp.default });
			});
		}

		public render() {
			const Component = this.state.component as React.SFC<any> | null;
			return Component ? <Component {...this.props} /> : null;
		}
	};
};
