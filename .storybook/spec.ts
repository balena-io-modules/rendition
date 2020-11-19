import initStoryshots, {
	Stories2SnapsConverter,
} from '@storybook/addon-storyshots';
import { render } from '@testing-library/react';

const converter = new Stories2SnapsConverter();

initStoryshots({
	storyKindRegex: /(Core|Extra)\/.*/,
	test: ({ story, context }) => {
		const snapshotFileName = converter.getSnapshotFileName(context);
		const storyElement = story.render();
		const { container } = render(storyElement);

		if (snapshotFileName) {
			expect(container).toMatchSpecificSnapshot(snapshotFileName);
		}
	},
});
