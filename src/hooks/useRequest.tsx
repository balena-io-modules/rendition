import * as React from 'react';
import { ResolvableReturnType } from '../common-types';
import { createPoll, Poll } from '../utils/poll';
interface UseRequestOptions {
	polling: boolean;
	pollInterval?: number;
	stopExecution?: boolean;
}

type RequestError = Error | null | undefined;
type ForcePoll = () => void;

// TODO: Change this to return only an object in the next major.
type UseRequestResult<TResult> = (
	| [TResult | undefined, true, RequestError, ForcePoll]
	| [TResult, false, RequestError, ForcePoll]
) &
	(
		| {
				data: TResult | undefined;
				isLoading: true;
				error: RequestError;
				forcePoll: ForcePoll;
		  }
		| {
				data: TResult;
				isLoading: false;
				error: RequestError;
				forcePoll: ForcePoll;
		  }
	);

export const useRequest = <
	TFn extends (poll: Poll | undefined) => Promise<any>,
	TResult extends ResolvableReturnType<TFn>,
>(
	action: TFn,
	deps:
		| React.DependencyList
		| Partial<Record<'persist' | 'reset', React.DependencyList>>,
	options: UseRequestOptions,
) => {
	const { polling, pollInterval, stopExecution } = options;
	const [loading, setLoading] = React.useState<boolean>(true);
	const [error, setError] = React.useState<RequestError>();
	const [data, setData] = React.useState<TResult>();
	const [isVisible, setIsVisible] = React.useState(true);
	const pollRef = React.useRef<Poll>();
	// Array.isArray does not let TS infer properly for readonly arrays
	const loadDataDeps =
		'persist' in deps || 'reset' in deps
			? [...(deps.persist ?? []), ...(deps.reset ?? [])]
			: (deps as React.DependencyList);

	React.useEffect(() => {
		const handleVisibilityChange = () => setIsVisible(!document.hidden);
		document.addEventListener('visibilitychange', handleVisibilityChange);
		return () =>
			document.removeEventListener('visibilitychange', handleVisibilityChange);
	});

	const loadData = React.useCallback(async (poll?: Poll) => {
		try {
			const response = await action(poll);
			setData(response);
		} catch (e) {
			if (e instanceof Error) {
				setError(e);
			} else {
				setError(new Error(typeof e === 'string' ? e : 'Unknown error'));
			}
			setData([] as TResult);
		} finally {
			setLoading(false);
		}
	}, loadDataDeps);

	const forcePoll = React.useCallback<ForcePoll>(() => {
		setLoading(true);
		if (pollRef.current) {
			pollRef.current.poll({ forced: true });
		} else {
			loadData();
		}
	}, [pollRef, loadData]);

	React.useEffect(() => {
		if (stopExecution) {
			return pollRef.current && pollRef.current.stop();
		}

		if (!polling) {
			loadData();
			return;
		}

		pollRef.current = createPoll(loadData, pollInterval, isVisible);
		pollRef.current.start();

		return () => {
			if (pollRef.current) {
				pollRef.current.destroy();
				pollRef.current = undefined;
			}
		};
	}, [polling, loadData, pollInterval, stopExecution, isVisible]);

	React.useEffect(() => {
		if (!polling) {
			return;
		}
		setData(undefined);
	}, [
		...('reset' in deps ? deps.reset ?? [] : (deps as React.DependencyList)),
		polling,
	]);

	React.useEffect(() => {
		if (!polling) {
			return;
		}
		forcePoll();
	}, loadDataDeps);

	const result = [data, loading, error, forcePoll] as UseRequestResult<TResult>;
	result.data = data;
	result.isLoading = loading;
	result.error = error;
	result.forcePoll = forcePoll;

	return result;
};
