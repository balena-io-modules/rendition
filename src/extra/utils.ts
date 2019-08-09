import marked from 'marked';
import sanitizeHtml from 'sanitize-html';

const renderer = new marked.Renderer();

renderer.link = function(_href, _title, _text) {
	const link = marked.Renderer.prototype.link.apply(this, arguments);
	return link.replace('<a', '<a target="_blank" rel="noopener noreferrer"');
};

const markedOptions = {
	// Enable github flavored markdown
	gfm: true,
	breaks: true,
	headerIds: false,
	// Input text is sanitized using `sanitize-html` prior to being transformed by
	// `marked`
	sanitize: false,
	renderer,
};

const sanitizerOptions = {
	allowedTags: sanitizeHtml.defaults.allowedTags.concat([
		'del',
		'h1',
		'h2',
		'img',
		'input',
	]),
	allowedAttributes: {
		a: ['href', 'name', 'target', 'rel'],
		img: ['src'],
		input: [
			{
				name: 'type',
				multiple: false,
				values: ['checkbox'],
			},
			'disabled',
			'checked',
		],
	},
};

export const parseMarkdown = (text: string = '') => {
	const html = marked(text, markedOptions);
	const clean = sanitizeHtml(html, sanitizerOptions as any);
	return clean;
};
