import marked from 'marked';
import sanitizeHtml from 'sanitize-html';

const defaultRenderer = (marked: any, renderer: any) => {
	renderer.link = function(_href: any, _title: any, _text: any) {
		const link = marked.Renderer.prototype.link.apply(this, arguments);
		return link.replace('<a', '<a target="_blank" rel="noopener noreferrer"');
	};

	return renderer;
};

const markedOptions = (marked: any, customRenderer: any = defaultRenderer) => {
	const markedRenderer = new marked.Renderer();
	const renderer = customRenderer(marked, markedRenderer);

	return {
		// Enable github flavored markdown
		gfm: true,
		breaks: true,
		headerIds: false,
		// Input text is sanitized using `sanitize-html` prior to being transformed by
		// `marked`
		sanitize: false,
		renderer,
	};
};

export const defaultSanitizerOptions = {
	allowedTags: sanitizeHtml.defaults.allowedTags.concat([
		'article',
		'aside',
		'del',
		'div',
		'h1',
		'h2',
		'header',
		'img',
		'input',
		'span',
	]),
	allowedAttributes: {
		a: ['href', 'name', 'target', 'rel'],
		img: ['src', 'class', 'title', 'alt'],
		input: [
			{
				name: 'type',
				multiple: false,
				values: ['checkbox'],
			},
			'disabled',
			'checked',
		],
		span: ['class'],
		div: ['class'],
		aside: ['class'],
		article: ['class'],
		header: ['class'],
	},
};

export const parseMarkdown = (
	renderer?: () => void,
	text: string = '',
	sanitizerOptions: sanitizeHtml.IOptions = defaultSanitizerOptions,
) => {
	const html = marked(text, markedOptions(marked, renderer));
	const clean = sanitizeHtml(html, sanitizerOptions as any);
	return clean;
};
