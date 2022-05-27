const DEFAULT_INTERVAL = 15000;
const DEFAULT_GRACE_RATIO = 0.33;

export class Poll {
	private _cancelled = true;

	// This flag is true when the poll is not running. You may
	// use it in your code to determine if you should proceed.
	public get cancelled(): boolean {
		return this._cancelled;
	}

	private _counter = 0;
	public get counter(): number {
		return this._counter;
	}

	private graceInterval: number;
	private pollInterval: NodeJS.Timer | null = null;
	private lastCompleteTime = 0;
	private blocked = false;
	private isTabActive: boolean;
	private fn: (poll: Poll) => Promise<any>;
	private interval: number;

	constructor(
		fn: (poll: Poll) => Promise<any>,
		interval: number,
		graceRatio: number,
		isTabActive: boolean,
	) {
		this.interval = interval;
		this.fn = fn;
		this.poll = this.poll.bind(this);
		this.graceInterval = this.interval * graceRatio;
		this.isTabActive = isTabActive;
	}

	public async poll(opts?: { forced?: boolean }) {
		// Only run poll if the previous call has finished and the poll
		// is not cancelled
		if (this.cancelled || this.blocked) {
			return;
		}

		const forced = opts && opts.forced;
		// Return if we're invisible, unless it's first run
		if (!forced && !this.isTabActive && this.lastCompleteTime !== 0) {
			return;
		}
		if (!forced && Date.now() - this.lastCompleteTime < this.graceInterval) {
			return;
		}
		this.blocked = true;

		try {
			await this.fn(this);
			this.lastCompleteTime = Date.now();
		} finally {
			this._counter++;
			this.blocked = false;
		}
	}

	public start() {
		// Only start polling if it is currently stopped.
		if (this.pollInterval != null) {
			return;
		}
		this.lastCompleteTime = 0;
		this._cancelled = false;
		this.pollInterval = setInterval(this.poll, this.interval);
		// Also run a poll instantly, as we wanted to start it *now*,
		// not X time in the future.
		return this.poll();
	}

	public stop() {
		if (this.pollInterval) {
			clearInterval(this.pollInterval);
		}
		this._cancelled = true;
		this.pollInterval = null;
	}

	public destroy() {
		this.stop();
		this.fn = async () => undefined; // break possible cyclic reference
	}
}

export const createPoll = (
	fn: (poll: Poll) => Promise<any>,
	interval: number = DEFAULT_INTERVAL,
	isTabActive: boolean = true,
	graceRatio: number = DEFAULT_GRACE_RATIO,
) => new Poll(fn, interval, graceRatio, isTabActive);
