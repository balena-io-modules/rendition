declare module 'tag-hoc' {
	import * as React from 'react';
	function tag(
		blacklist: string[],
	): <P extends object>(type: React.Component<P>) => React.Component<P>;

	export = tag;
}
