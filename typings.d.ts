declare module 'resin-components' {
	import { Component } from 'react';

	interface DefaultProps {
		width?: number;
		w?: number;
		fontSize?: number;
		f?: number;
		color?: string;
		bg?: string;
		m?: number;
		mt?: number;
		mr?: number;
		mb?: number;
		ml?: number;
		mx?: number;
		my?: number;
		p?: number;
		pt?: number;
		pr?: number;
		pb?: number;
		pl?: number;
		px?: number;
		py?: number;
		className?: string;
	}

	type PineDataType =
		| 'Boolean'
		| 'Case Insensitive Text'
		| 'Date Time'
		| 'Date'
		| 'Integer'
		| 'Real'
		| 'Short Text'
		| 'Text'
		| 'Time'
		| 'Semver Range'
		| 'Semver';

	interface Schema {
		[key: string]: {
			type: PineDataType;
			label?: string;
		};
	}

	interface FilterRule {
		availableOperators: string[];
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

	class RenderableElementWithProps<PropsType, StateType> extends Component<
		PropsType,
		StateType
	> {
		refs: any;
		render(): JSX.Element | null;
	}

	interface CodeWithCopyProps extends DefaultProps {
		copy: string;
		text: string;
	}

	class CodeWithCopy extends RenderableElementWithProps<
		CodeWithCopyProps,
		any
	> {
		refs: any;
		render(): JSX.Element | null;
	}

	interface DeviceStatusGaugeProps extends DefaultProps {
		devices: any[];
	}

	class DeviceStatusGauge extends RenderableElementWithProps<
		DeviceStatusGaugeProps,
		any
	> {
		refs: any;
		render(): JSX.Element | null;
	}

	interface FiltersProps extends DefaultProps {
		rules: FilterRule[];
		views: FilterViewScope[];
		schema: Schema;
		setViews(views: SingleFilterView[]): void;
		setRules(rules: FilterRule[]): void;
	}

	class Filters extends RenderableElementWithProps<FiltersProps, any> {
		refs: any;
		render(): JSX.Element | null;
	}

	interface ProgressBarProps extends DefaultProps {
		value: number;
		info?: boolean;
	}

	class ProgressBar extends RenderableElementWithProps<ProgressBarProps, any> {
		refs: any;
		render(): JSX.Element | null;
	}

	class Provider extends Component<any, any> {
		refs: any;
		render(): JSX.Element | null;
	}

	class SchemaSieveClass {
		filter<T>(items: T[], rule: FilterRule): T[];
	}

	function SchemaSieve(): SchemaSieveClass;
}
