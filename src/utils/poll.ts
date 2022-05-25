const DEFAULT_INTERVAL = 15000;
const DEFAULT_GRACE_RATIO = 0.33;

export interface Poll {
	poll: (opts?: { forced?: boolean }) => void;
	start: () => void;
	stop: () => void;
	destroy: () => void;
}

const pollFactory = (
	fn: () => Promise<any>,
	interval: number,
	graceRatio: number,
	isTabActive: boolean,
) => {
	let cancelled = true;
	const graceInterval: number = interval * graceRatio;
	let pollInterval: NodeJS.Timer | null = null;
	let lastCompleteTime = 0;
	let counter = 0;
	let blocked = false;

	const poll = async (opts?: { forced?: boolean }) => {
		// Only run poll if the previous call has finished and the poll
		// is not cancelled
		if (cancelled || blocked) {
			return;
		}

		const forced = opts && opts.forced;
		// Return if we're invisible, unless it's first run
		if (!forced && !isTabActive && lastCompleteTime !== 0) {
			return;
		}
		if (!forced && Date.now() - lastCompleteTime < graceInterval) {
			return;
		}
		blocked = true;

		try {
			await fn();
			lastCompleteTime = Date.now();
		} finally {
			counter++;
			blocked = false;
		}
	};

	const start = () => {
		// Only start polling if it is currently stopped.
		if (pollInterval != null) {
			return;
		}
		lastCompleteTime = 0;
		cancelled = false;
		pollInterval = setInterval(poll, interval);
		// Also run a poll instantly, as we wanted to start it *now*,
		// not X time in the future.
		return poll();
	};

	const stop = () => {
		if (pollInterval) {
			clearInterval(pollInterval);
		}
		cancelled = true;
		pollInterval = null;
	};

	const destroy = () => {
		stop();
		fn = async () => undefined; // break possible cyclic reference
	};

	return {
		poll,
		start,
		stop,
		destroy,
	};
};

export const createPoll = (
	fn: () => Promise<any>,
	interval: number = DEFAULT_INTERVAL,
	isTabActive: boolean = true,
	graceRatio: number = DEFAULT_GRACE_RATIO,
) => pollFactory(fn, interval, graceRatio, isTabActive);
