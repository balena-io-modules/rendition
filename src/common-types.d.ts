type ResponsiveStyle = string | number | Array<string | number>;

interface Theme {
	breakpoints: number[];
	space: number[];
	fontSizes: number[];
	weights: number[];
	font: string;
	monospace: string;
	colors: {
		[key: string]: {
			main: string;
			light?: string;
			dark?: string;
		};
	};
	radius: number;
}

interface StyledSystemProps {
	width?: ResponsiveStyle;
	w?: ResponsiveStyle;
	fontSize?: ResponsiveStyle;
	f?: ResponsiveStyle;
	color?: ResponsiveStyle;
	bg?: ResponsiveStyle;
	m?: ResponsiveStyle;
	mt?: ResponsiveStyle;
	mr?: ResponsiveStyle;
	mb?: ResponsiveStyle;
	ml?: ResponsiveStyle;
	mx?: ResponsiveStyle;
	my?: ResponsiveStyle;
	p?: ResponsiveStyle;
	pt?: ResponsiveStyle;
	pr?: ResponsiveStyle;
	pb?: ResponsiveStyle;
	pl?: ResponsiveStyle;
	px?: ResponsiveStyle;
	py?: ResponsiveStyle;
}

// Cherry pick the react attributes that don't conflict with styled-system
interface DefaultProps
	extends StyledSystemProps,
		React.DOMAttributes<HTMLElement> {
	// React-specific Attributes
	defaultChecked?: boolean;
	defaultValue?: string | string[];
	suppressContentEditableWarning?: boolean;

	// Standard HTML Attributes
	accessKey?: string;
	className?: string;
	contentEditable?: boolean;
	contextMenu?: string;
	dir?: string;
	draggable?: boolean;
	hidden?: boolean;
	id?: string;
	lang?: string;
	slot?: string;
	spellCheck?: boolean;
	style?: React.CSSProperties;
	tabIndex?: number;
	title?: string;
}

type PineDataType =
	| 'Boolean'
	| 'Case Insensitive Text'
	| 'Date Time'
	| 'Date'
	| 'Enum'
	| 'Integer'
	| 'Real'
	| 'Short Text'
	| 'Text'
	| 'Time'
	| 'Semver Range'
	| 'Semver';

interface SchemaEntry {
	type: PineDataType;
	values?: string[];
	label?: string;
}

interface Schema {
	[key: string]: SchemaEntry;
}

interface FilterRule {
	availableOperators: Array<{ value: string; label: string }>;
	id: string;
	label: string;
	name: string;
	operator: string;
	type: string;
	value: any;
}

interface SingleFilterView {
	id: string;
	name: string;
	scopeKey: string;
	rules: FilterRule[];
}

interface FilterViewScope {
	key: string;
	scopeLabel?: string;
	title?: string;
	data: SingleFilterView[];
}

interface Coloring {
	primary?: boolean;
	secondary?: boolean;
	tertiary?: boolean;
	quartenary?: boolean;
	danger?: boolean;
	warning?: boolean;
	success?: boolean;
	info?: boolean;
}

interface Sizing {
	emphasized?: boolean;
}
