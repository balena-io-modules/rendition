import React, { Component } from 'react';

// Load given React component asynchronously, needed when implementing WASM
export const Async = (importComponent: () => Promise<any>) => {
	return class extends Component {
		displayName = importComponent;

		state = {
			component: null,
		};

		componentDidMount() {
			importComponent().then(cmp => {
				this.setState({ component: cmp.default });
			});
		}

		render() {
			const Component = this.state.component as React.SFC<any> | null;
			return Component ? <Component {...this.props} /> : null;
		}
	};
};
