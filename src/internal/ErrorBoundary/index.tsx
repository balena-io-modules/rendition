import React from 'react';
import { Flex } from '../../components/Flex';
import { Alert } from '../../components/Alert';

interface ErrorBoundaryState {
	error: any;
}

interface ErrorBoundaryProps {
	getErrorDisplay?: (error: any) => JSX.Element;
}

const DefaultErrorDisplay = () => (
	<Flex flex={1} alignItems="center" justifyContent="center">
		<Alert m={2} plaintext danger>
			Something went wrong
		</Alert>
	</Flex>
);

export default class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { error: null };
	}

	static getDerivedStateFromError(error: any) {
		return { error };
	}

	componentDidUpdate(prevProps: any) {
		if (this.state.error && prevProps !== this.props) {
			this.setState({ error: null });
		}
	}

	render() {
		if (this.state.error) {
			return this.props.getErrorDisplay ? (
				this.props.getErrorDisplay(this.state.error)
			) : (
				<DefaultErrorDisplay />
			);
		}

		return this.props.children;
	}
}
