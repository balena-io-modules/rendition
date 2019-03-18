declare module 'tag-hoc' {
	import * as React from 'react';
	function tag(
		blacklist: string[],
	): <P extends object>(
		type: React.StatelessComponent<P>,
	) => React.StatelessComponent<P>;

	export = tag;
}
