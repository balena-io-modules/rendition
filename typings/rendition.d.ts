declare module 'rendition' {
	import { Component } from 'react';
	import * as Xterm from 'xterm';

	type ResponsiveStyle = string | number | Array<string | number>;

	interface StyledSystemProps {
		width?: ResponsiveStyle;
		w?: ResponsiveStyle;
		fontSize?: ResponsiveStyle;
		f?: ResponsiveStyle;
		color?: string;
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

	type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';
	interface TooltipProps {
		text: string;
		trigger?: 'click' | 'hover';
		placement?: TooltipPlacement;
	}

	interface Tooltip {
		tooltip?: string | TooltipProps;
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
		| 'Semver'
		| 'Key Value Pair';

	interface SchemaEntry {
		type: PineDataType;
		values?: string[];
		key?: string;
		value?: string;
		label?: string;
		keyLabel?: string;
		valueLabel?: string;
	}

	interface Schema {
		[key: string]: SchemaEntry;
	}

	interface FilterRule extends FilterModel {
		id: string;
		extra?: {
			or: FilterModel[];
		};
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

	class RenderableElementWithProps<PropsType, StateType> extends Component<
		PropsType,
		StateType
	> {}

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

	interface AlertProps extends DefaultProps, Coloring, Sizing {
		plaintext?: boolean;
		prefix?: JSX.Element | string | false;
		onDismiss?: () => void;
	}

	class Alert extends RenderableElementWithProps<AlertProps, any> {}

	interface BadgeProps extends BoxProps, Coloring {
		text: string;
		small?: boolean;
	}

	class Badge extends RenderableElementWithProps<BadgeProps, any> {}

	interface BadgeSelectProps extends DropDownButtonProps {
		items: string[];
		extraPrefix?: string[];
		extraSuffix?: string[];
		extra?: string[];
		onItemChange?: (value: string) => void;
		defaultSelected?: string;
		placeholder?: string;
	}

	class BadgeSelect extends RenderableElementWithProps<BadgeSelectProps, any> {}

	interface BannerProps extends DefaultProps {
		backgroundImage?: string;
		minHeight?: string;
	}

	class Banner extends RenderableElementWithProps<BoxProps, any> {}

	interface BoxProps extends DefaultProps {
		flex?: string | string[];
		order?: number | string | Array<number | string>;
	}

	class Box extends RenderableElementWithProps<BoxProps, any> {}

	interface ButtonProps extends DefaultProps, Coloring, Sizing, Tooltip {
		square?: boolean;
		disabled?: boolean;
		outline?: boolean;
		plaintext?: boolean;
		underline?: boolean;
		iconElement?: JSX.Element;
	}

	class Button extends RenderableElementWithProps<ButtonProps, any> {}

	interface CodeWithCopyProps extends DefaultProps, Tooltip {
		copy?: string;
		text: string;
	}

	class CodeWithCopy extends RenderableElementWithProps<
		CodeWithCopyProps,
		any
	> {}

	class Container extends RenderableElementWithProps<DefaultProps, any> {}

	class DeleteButton extends RenderableElementWithProps<DefaultProps, any> {}

	interface DeviceStatusGaugeProps extends DefaultProps {
		devices: any[];
	}

	class DeviceStatusGauge extends RenderableElementWithProps<
		DeviceStatusGaugeProps,
		any
	> {}

	interface DividerProps extends DefaultProps {
		height?: number;
	}

	class Divider extends RenderableElementWithProps<DefaultProps, any> {}

	interface DropDownButtonProps extends DefaultProps, Coloring {
		disabled?: boolean;
		label?: JSX.Element;
		border?: boolean;
		joined?: boolean;
		outline?: boolean;
		alignRight?: boolean;
		noListFormat?: boolean;
	}

	class DropDownButton extends RenderableElementWithProps<
		DropDownButtonProps,
		any
	> {}

	interface FiltersProps extends DefaultProps {
		disabled?: boolean;
		rules: FilterRule[];
		views: FilterViewScope[];
		schema: Schema;
		setViews(views: FilterViewScope[]): void;
		setRules(rules: FilterRule[]): void;
		addFilterButtonProps?: ButtonProps;
		viewsMenuButtonProps?: DropDownButtonProps;
		dark?: boolean;
	}

	class Filters extends RenderableElementWithProps<FiltersProps, any> {}

	interface FixedProps extends DefaultProps {
		top?: boolean | ResponsiveStyle;
		right?: boolean | ResponsiveStyle;
		bottom?: boolean | ResponsiveStyle;
		left?: boolean | ResponsiveStyle;
		z?: ResponsiveStyle;
	}

	class Fixed extends RenderableElementWithProps<FixedProps, any> {}

	interface FlexProps extends BoxProps {
		align?: string | string[];
		justify?: string | string[];
		direction?: string | string[];
		wrap?: boolean | boolean[] | string;
		column?: boolean;
	}

	class Flex extends RenderableElementWithProps<FlexProps, any> {}

	namespace Heading {
		/* tslint:disable:class-name */
		class h1 extends RenderableElementWithProps<FlexProps, any> {}
		class h2 extends RenderableElementWithProps<FlexProps, any> {}
		class h3 extends RenderableElementWithProps<FlexProps, any> {}
		class h4 extends RenderableElementWithProps<FlexProps, any> {}
		class h5 extends RenderableElementWithProps<FlexProps, any> {}
		class h6 extends RenderableElementWithProps<FlexProps, any> {}
		/* tslint:enable:class-name */
	}

	interface LinkProps extends DefaultProps {
		blank?: boolean;
		disabled?: boolean;
		download?: any;
		href?: string;
		hrefLang?: string;
		media?: string;
		rel?: string;
		target?: string;
		type?: string;
		as?: string;
	}

	class Link extends RenderableElementWithProps<LinkProps, any> {}

	interface InputProps extends DefaultProps, Sizing {
		monospace?: boolean;
		autoComplete?: string;
		autoFocus?: boolean;
		disabled?: boolean;
		form?: string;
		max?: number | string;
		maxLength?: number;
		min?: number | string;
		minLength?: number;
		name?: string;
		placeholder?: string;
		readOnly?: boolean;
		required?: boolean;
		type?: string;
		value?: string | string[] | number;

		invalid?: boolean;
		valid?: boolean;
		onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
	}

	class Input extends RenderableElementWithProps<InputProps, any> {}

	class Image extends RenderableElementWithProps<
		DefaultProps & React.ImgHTMLAttributes<HTMLImageElement>,
		any
	> {}

	interface ModalProps extends DefaultProps {
		title?: string;
		titleElement?: string | JSX.Element;
		titleDetails?: string | JSX.Element;
		action?: string | JSX.Element;
		cancel?: () => any;
		done: () => any;
		primaryButtonProps?: ButtonProps;
		secondaryButtonProps?: ButtonProps;
		cancelButtonProps?: ButtonProps;
	}

	class Modal extends RenderableElementWithProps<ModalProps, any> {}

	class Navbar extends RenderableElementWithProps<
		DefaultProps & {
			brand: JSX.Element;
		},
		any
	> {}

	type PineTypeOperatorTest = (target: any, value?: any) => boolean;
	type AdvancedPineOperatorTest = {
		getLabel: (schemaEntry: SchemaEntry) => string | false;
		test: PineTypeOperatorTest;
	};

	interface PineTypeModule {
		rules: {
			[key: string]: PineTypeOperatorTest | AdvancedPineOperatorTest;
		};
		validate: (value: any) => boolean;
		normalize: <T>(value: any) => T;
		Edit: (props: any) => JSX.Element;
		Display: (props: any) => JSX.Element;
	}

	const PineTypes: { [K in PineDataType]: PineTypeModule };

	class Provider extends Component<any, any> {}

	interface ProgressBarProps extends DefaultProps, Coloring {
		value: number;
	}

	class ProgressBar extends RenderableElementWithProps<ProgressBarProps, any> {}

	interface FilterModel {
		availableOperators: Array<{ label: string; value: string }>;
		label?: string;
		name: string;
		operator: string | null;
		type: string;
		value: any;
	}

	class SchemaSieveClass {
		SIMPLE_SEARCH_NAME: string;
		tests: { [key: string]: PineTypeModule };
		test(item: any, filter: FilterRule | FilterRule[]): boolean;
		filter<T>(items: T[], rule: FilterRule | FilterRule[]): T[] | Partial<T>;
		makeFilterInputs(
			schema: Schema,
		): {
			[key: string]: FilterModel;
		};
	}

	function SchemaSieve(): SchemaSieveClass;

	interface SelectProps extends DefaultProps, Sizing {
		value?: string | string[] | number | null;
	}

	class Select extends RenderableElementWithProps<SelectProps, any> {}

	type TableSortFunction = <T>(a: T, b: T) => number;

	interface TableColumn<T> {
		field: keyof T;
		icon?: string;
		label?: string | JSX.Element;
		sortable?: boolean | TableSortFunction;
		render?: (value: any, row: T) => string | number | JSX.Element | null;
	}

	interface TableProps<T> {
		columns: Array<TableColumn<T>>;
		data: T[];
		// Optionally provide a key that should be used as a unique identifier for each row
		rowKey?: keyof T;

		// Only usable if a rowKey property is also provided.
		// If an onCheck property is provided , then checkboxes will be renders,
		// allowing rows to be selected.
		onCheck?: (checkedItems: T[]) => void;

		onRowClick?: (row: T, event: React.MouseEvent<HTMLAnchorElement>) => void;
		getRowHref?: (row: T) => string;
		rowAnchorAttributes?: React.AnchorHTMLAttributes<HTMLAnchorElement>;

		tbodyPrefix?: JSX.Element | JSX.Element[];
	}

	class Table<T> extends RenderableElementWithProps<TableProps<T>, any> {}

	interface TerminalProps {
		ttyInstance?: Xterm.Terminal | null;
		// Prevents tty instance from being destroyed when terminal unmounts
		persistent?: boolean;
		nonInteractive?: boolean;
		color?: string;
		config?: Xterm.ITerminalOptions;
	}

	class Terminal extends RenderableElementWithProps<TerminalProps, any> {
		readonly tty: Xterm.Terminal;
		resize: () => void;
		clear: () => void;
		writeln: (line: string) => void;
		write: (line: string) => void;
		destroy: () => void;
	}

	interface TextProps extends DefaultProps {
		monospace?: boolean;
		bold?: boolean;
		align?:
			| 'left'
			| 'right'
			| 'center'
			| 'justify'
			| 'justify-all'
			| 'start'
			| 'end'
			| 'match-parent'
			| 'inherit'
			| 'initial'
			| 'unset';
	}

	class Text extends RenderableElementWithProps<TextProps, any> {}

	// also expose the HTML tag variant constructors
	// that we support & make available as static properties
	namespace Text {
		/* tslint:disable:class-name */
		class span extends Text {}
		class p extends Text {}
		/* tslint:enable:class-name */
	}

	interface TextWithCopyProps extends DefaultProps {
		copy: string;
		showCopyButton?: 'hover' | 'always';
	}

	class TextWithCopy extends RenderableElementWithProps<
		TextWithCopyProps,
		any
	> {}

	interface TextareaProps extends DefaultProps {
		autoComplete?: string;
		autoFocus?: boolean;
		cols?: number;
		dirName?: string;
		disabled?: boolean;
		form?: string;
		maxLength?: number;
		minLength?: number;
		name?: string;
		placeholder?: string;
		readOnly?: boolean;
		required?: boolean;
		rows?: number;
		value?: string | string[] | number;
		wrap?: string;

		onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
	}

	class Textarea extends RenderableElementWithProps<TextareaProps, any> {}

	interface ThemeColorSet {
		main: string;
		light: string;
		dark: string;
	}

	interface WithSemilight {
		semilight: string;
	}

	interface Theme {
		breakpoints: number[];
		space: number[];
		fontSizes: number[];
		weights: number[];
		font: string;
		monospace: string;
		colors: {
			primary: ThemeColorSet;
			secondary: ThemeColorSet;
			tertiary: ThemeColorSet;
			quartenary: ThemeColorSet;
			danger: ThemeColorSet & WithSemilight;
			warning: ThemeColorSet & WithSemilight;
			success: ThemeColorSet & WithSemilight;
			info: ThemeColorSet & WithSemilight;
			text: ThemeColorSet;
			gray: ThemeColorSet;
		};
		radius: number;
	}

	const Theme: Theme;
}
