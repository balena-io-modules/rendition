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

	class Img extends RenderableElementWithProps<
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

	class Provider extends Component<any, any> {}

	interface ProgressBarProps extends DefaultProps, Coloring {
		value: number;
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
	}

	export const SchemaSieve: SchemaSieve;

	interface SelectProps extends DefaultProps, Sizing {
		value?: string | string[] | number | null;
		disabled?: boolean;
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
		p: TxtP;
		span: TxtSpan;
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

	interface Migrations {
		migrateLegacyFilter(
			schema: JSONSchema6,
			legacyFilter: v3.Filter,
		): JSONSchema6;
		migrateLegacyViews(
			schema: JSONSchema6,
			legacyViews: v3.FilterViewScope[],
		): {
			views: FiltersView[];
			viewScopes: ViewScope[];
		};
		migrateLegacySchema(legacySchema: v3.Schema): JSONSchema6;
	}

	export const migrations: Migrations;
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

	interface FormProps extends BoxProps {
		schema: JSONSchema6;
		submitButtonText?: string | JSX.Element;
		hideSubmitButton?: boolean;
		submitButtonProps?: ButtonProps;
		value?: number | string | boolean | AnyObject | any[] | null;
		onFormChange?: (result: IChangeEvent) => void;
		onFormSubmit?: (result: any) => void;
		uiSchema?: UiSchema;
	}

	class Form extends RenderableElementWithProps<FormProps, any> {}
}
