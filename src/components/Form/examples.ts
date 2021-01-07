import { MermaidWidget } from '../../extra/Form/mermaid';
import { MarkdownWidget } from '../../extra/Form/markdown';
import { CaptchaWidget } from '../../extra/Form/captcha';
import { Format } from '../Renderer/types';

export const EXTRA_FORMATS: Format[] = [
	{ name: 'markdown', format: '.*', widget: MarkdownWidget },
	{ name: 'mermaid', format: '.*', widget: MermaidWidget },
	// @ts-ignore
	{ name: 'captcha', format: '.*', widget: CaptchaWidget },
];
