declare module 'rendition' {
	import { JSONSchema6 } from 'json-schema';
	import { Component } from 'react';
	import * as Xterm from 'xterm';

	type ResponsiveStyle = string | number | Array<string | number>;

	type AnyObject = {
		[index: string]: any;
	};

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
		innerRef?: (element: HTMLElement) => void;
	}

	type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';
	interface TooltipProps {
		text: string;
		trigger?: 'click' | 'hover';
		placement?: TooltipPlacement;
		containerStyle?: React.CSSProperties;
		innerStyle?: React.CSSProperties;
		arrowStyle?: React.CSSProperties;
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

	interface DataTypeModel {
		operators: {
			[key: string]: {
				getLabel: (schema: JSONSchema6) => string;
			};
		};
		decodeFilter(filter: JSONSchema6): null | FilterSignature;
		createFilter(
			field: string,
			operator: string,
			value: any,
			schema: JSONSchema6,
		): JSONSchema6;
		Edit(props: DataTypeEditProps): JSX.Element;
	}

	interface DataTypeEditProps {
		schema: JSONSchema6;
		value?: any;
		onUpdate: (value: string | number | boolean) => void;
		operator: string;
		slim?: boolean;
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

	interface BoxProps extends DefaultProps, Tooltip {
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
		type?: 'submit' | 'reset' | 'button';
	}

	class Button extends RenderableElementWithProps<ButtonProps, any> {}

	interface CodeWithCopyProps extends DefaultProps, Tooltip {
		copy?: string;
		text: string;
		showCopyButton?: 'hover' | 'always';
	}

	interface CardProps extends DefaultProps {
		title?: string;
		cta?: JSX.Element;
		rows?: JSX.Element[];
		children?: any;
		minHeight?: string;
	}

	class Card extends RenderableElementWithProps<CardProps, any> {}

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

	class Divider extends RenderableElementWithProps<DividerProps, any> {}

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

	interface FiltersView {
		id: string;
		name: string;
		scope?: string | null;
		filters: JSONSchema6[];
	}

	interface ViewScope {
		slug: string;
		name: string;
		label?: string;
	}

	interface FilterSignature {
		field: string;
		operator: string;
		value: string | number | boolean | { [k: string]: string };
	}

	type FilterRenderMode = 'all' | 'add' | 'search' | 'views' | 'summary';

	interface FiltersProps extends DefaultProps {
		disabled?: boolean;
		filters?: JSONSchema6[];
		views?: FiltersView[];
		viewScopes?: ViewScope[];
		onFiltersUpdate?: (filters: JSONSchema6[]) => void;
		onViewsUpdate?: (views: FiltersView[]) => void;
		schema: JSONSchema6;
		addFilterButtonProps?: ButtonProps;
		viewsMenuButtonProps?: DropDownButtonProps;
		renderMode?: FilterRenderMode | FilterRenderMode[];
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
		flexDirection?: string | string[];
		wrap?: boolean | boolean[] | string;
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

	interface LinkProps extends DefaultProps, Tooltip {
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
		onChange?: React.ChangeEventHandler<HTMLInputElement>;
	}

	class Input extends RenderableElementWithProps<InputProps, any> {}

	class Img extends RenderableElementWithProps<
		DefaultProps & React.ImgHTMLAttributes<HTMLImageElement>,
		any
	> {}

	interface SearchProps extends DefaultProps {
		dark?: boolean;
		disabled?: boolean;
		placeholder?: string;
		value: string;
		onChange: (value: any) => void;
	}

	class Search extends RenderableElementWithProps<SearchProps, any> {}

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
		containerStyle?: React.CSSProperties;
	}

	class Modal extends RenderableElementWithProps<ModalProps, any> {}

	class Navbar extends RenderableElementWithProps<
		DefaultProps & {
			brand: JSX.Element;
		},
		any
	> {}

	interface PagerProps extends DefaultProps {
		totalItems: number;
		itemsPerPage: number;
		page: number;
		nextPage: () => void;
		prevPage: () => void;
	}

	class Pager extends RenderableElementWithProps<PagerProps, any> {}

	class Provider extends Component<any, any> {}

	type PillProps = Coloring &
		Shading &
		TxtProps & {
			small?: boolean;
			style?: React.CSSProperties;
		};

	class Pill extends RenderableElementWithProps<PillProps, any> {}

	interface ProgressBarProps extends DefaultProps, Coloring, Sizing {
		value: number;
		color?: string;
		background?: string;
	}

	class ProgressBar extends RenderableElementWithProps<ProgressBarProps, any> {}

	interface SchemaSieve {
		filter<T>(filters: JSONSchema6 | JSONSchema6[], collection: T[]): T[];
		getDataModel(schema: JSONSchema6): null | DataTypeModel;
		createFullTextSearchFilter(schema: JSONSchema6, term: string): JSONSchema6;
		upsertFullTextSearch(
			schema: JSONSchema6,
			filters: JSONSchema6[],
			term: string,
		): JSONSchema6[];
		removeFullTextSearch(filters: JSONSchema6[]): JSONSchema6[];
		createFilter(
			schema: JSONSchema6,
			signatures: FilterSignature[],
		): JSONSchema6;
		decodeFilter(schema: JSONSchema6, filter: JSONSchema6): FilterSignature[];
		getOperators(
			schema: JSONSchema6,
			field: string,
		): Array<{ slug: string; label: string }>;
		flattenSchema(schema: JSONSchema6, delimiter?: string): JSONSchema6;
		unflattenSchema(schema: JSONSchema6, delimiter?: string): JSONSchema6;
	}

	export const SchemaSieve: SchemaSieve;

	interface SelectProps extends DefaultProps, Sizing {
		value?: string | string[] | number | null;
		disabled?: boolean;
		onChange?: React.ChangeEventHandler<HTMLSelectElement>;
	}

	class Select extends RenderableElementWithProps<SelectProps, any> {}

	type TableSortFunction = <T>(a: T, b: T) => number;

	interface TableColumn<T> {
		cellAttributes?:
			| React.AnchorHTMLAttributes<HTMLAnchorElement>
			| ((value: any, row: T) => React.AnchorHTMLAttributes<HTMLAnchorElement>);
		field: keyof T;
		icon?: string;
		label?: string | JSX.Element;
		render?: (value: any, row: T) => string | number | JSX.Element | null;
		sortable?: boolean | TableSortFunction;
	}

	interface TableProps<T> {
		columns: Array<TableColumn<T>>;
		data: T[];
		getRowHref?: (row: T) => string;
		// Only usable if a rowKey property is also provided.
		// If an onCheck property is provided , then checkboxes will be renders,
		// allowing rows to be selected.
		onCheck?: (checkedItems: T[]) => void;
		onRowClick?: (row: T, event: React.MouseEvent<HTMLAnchorElement>) => void;
		rowAnchorAttributes?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
		rowCheckboxAttributes?: React.InputHTMLAttributes<HTMLInputElement>;
		// Optionally provide a key that should be used as a unique identifier for each row
		rowKey?: keyof T;
		tbodyPrefix?: JSX.Element | JSX.Element[];
		// Highlights a row. This property requires that you have provided a
		// `rowKey` property: the row with a `rowKey` property that matches this
		// value is highlighted.
		highlightedRows?: any;
		getRowClass?: (row: T) => string[];
		// If true, a pager will be used when displaying items.
		usePager?: boolean;
		// The number of items to be shown per page. Only used if `usePager` is true. Defaults to `50`.
		itemsPerPage?: number;
		// Sets whether the pager is displayed at the top of the table, the bottom of the table or
		// in both positions. Only used if `usePager` is true. Defaults to `top`.
		pagerPosition?: 'top' | 'bottom' | 'both';
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

	interface TxtProps extends DefaultProps, Tooltip {
		monospace?: boolean;
		bold?: boolean;
		caps?: boolean;
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

	class TxtP extends RenderableElementWithProps<TxtProps, any> {}
	class TxtSpan extends RenderableElementWithProps<TxtProps, any> {}

	class Txt extends RenderableElementWithProps<TxtProps, any> {
		static p: typeof TxtP;
		static span: typeof TxtSpan;
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
		monospace?: boolean;
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
		value?: string;
		wrap?: string;

		onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
		autoRows?: boolean;
		maxRows?: number;
		minRows?: number;
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

	type ColorShade = keyof ThemeColorSet;

	type Shading = { shade?: ColorShade };

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

	namespace v3 {
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

		interface BaseFilter {
			availableOperators: Array<{ label: string; value: string }>;
			label?: string;
			name: string;
			operator: string | null;
			type: PineDataType;
			value: any;
		}

		interface Filter extends BaseFilter {
			id: string;
			extra?: {
				or: BaseFilter[];
			};
		}

		interface SingleFilterView {
			id: string;
			name: string;
			scopeKey: string;
			rules: Filter[];
		}

		interface FilterViewScope {
			key: string;
			scopeLabel?: string;
			title?: string;
			data: SingleFilterView[];
		}
	}

	interface MigrateLegacyViewsOutput {
		views: FiltersView[];
		viewScopes: ViewScope[];
	}

	interface Migrations {
		migrateLegacyFilter(
			schema: JSONSchema6,
			legacyFilter: v3.Filter,
		): JSONSchema6;
		migrateLegacyViews(
			schema: JSONSchema6,
			legacyViews:
				| v3.FilterViewScope[]
				| MigrateLegacyViewsOutput
				| FiltersView[],
		): MigrateLegacyViewsOutput;
		migrateLegacySchema(legacySchema: v3.Schema): JSONSchema6;
	}

	export const migrations: Migrations;
}

declare module 'rendition/dist/extra/Form/mermaid' {

}

declare module 'rendition/dist/extra/Form/markdown' {

}

declare module 'rendition/dist/extra/Markdown' {
	import { RenderableElementWithProps, TxtProps } from 'rendition';

	interface MarkdownProps extends TxtProps {
		children: string;
	}

	class Markdown extends RenderableElementWithProps<MarkdownProps, any> {}
}

declare module 'rendition/dist/extra/Mermaid' {
	import { BoxProps, RenderableElementWithProps } from 'rendition';

	interface MermaidProps extends BoxProps {
		value: string;
	}

	class Mermaid extends RenderableElementWithProps<MermaidProps, any> {}
}

declare module 'rendition/dist/unstable' {
	import { JSONSchema6 } from 'json-schema';
	import { Component } from 'react';
	import { IChangeEvent, UiSchema } from 'react-jsonschema-form';
	import {
		AnyObject,
		BoxProps,
		ButtonProps,
		RenderableElementWithProps,
	} from 'rendition';

	/**
	 * Properties passed to custom Form widgets
	 *
	 * @see https://github.com/mozilla-services/react-jsonschema-form#custom-widget-components
	 */
	interface FormWidgetProps {
		/** The generated id for this field */
		id: string;

		/** The JSONSchema subschema object for this field */
		schema: JSONSchema6;

		/** The current value for this field */
		value: any;

		/** The required status of this field */
		required: boolean;

		/** true if the widget is disabled */
		disabled: boolean;

		/** true if the widget should be autofocused */
		autofocus: boolean;

		/** true if the widget is read-only */
		readonly: boolean;

		/** The value change event handler; call it with the new value everytime it changes */
		onChange: (value: any) => void;

		/** The input blur event handler; call it with the the widget id and value */
		onBlur: (id: string, value: any) => void;

		/** The input focus event handler; call it with the the widget id and value */
		onFocus: (id: string, value: any) => void;

		/**
		 * A map of options passed as a prop to the component
		 * @see https://github.com/mozilla-services/react-jsonschema-form#custom-widget-options
		 */
		options: AnyObject;

		/** The formContext object that you passed to Form. */
		formContext: any;

		type?: string;
	}

	interface RenditionUiSchema {
		'ui:warning'?: string;
	}

	interface FormProps extends BoxProps {
		schema: JSONSchema6;
		submitButtonText?: string | JSX.Element;
		hideSubmitButton?: boolean;
		submitButtonProps?: ButtonProps;
		value?: number | string | boolean | AnyObject | any[] | null;
		onFormChange?: (result: IChangeEvent) => void;
		onFormSubmit?: (result: any) => void;
		uiSchema?: RenditionUiSchema;
	}

	class Form extends RenderableElementWithProps<FormProps, any> {}
}
