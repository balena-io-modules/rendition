import ArrayWidget from './ArrayWidget';
import BadgeWidget from './BadgeWidget';
import ButtonGroupWidget from './ButtonGroupWidget';
import ButtonWidget from './ButtonWidget';
import CheckboxWidget from './CheckboxWidget';
import ColorWidget from './ColorWidget';
import DropDownButtonWidget from './DropDownButtonWidget';
import HeadingWidget from './HeadingWidget';
import HighlightedNameWidget from './HighlightedNameWidget';
import ImgWidget from './ImgWidget';
import LinkWidget from './LinkWidget';
import ListWidget from './ListWidget';
import ObjectWidget from './ObjectWidget';
import ProgressBarWidget from './ProgressBarWidget';
import TagWidget from './TagWidget';
import TxtWidget from './TxtWidget';
import { Format } from '../types';
import { Widget, withOptionProps } from './widget-util';
import { ElapsedTimeWidget } from './ElapsedTimeWidget';
export { WidgetWrapperUiOptions } from './ui-options';
export {
	getObjectPropertyNames,
	widgetFactory as WidgetFactory,
} from './widget-util';
export { default as WidgetMeta } from './WidgetMeta';

type Widgets = {
	[key: string]: Widget;
};

export const defaultFormats: Format[] = [
	{
		name: 'color',
		format: '.*',
		widget: ColorWidget,
	},
	{
		name: 'uri',
		format: '.*',
		widget: LinkWidget,
	},
	{
		name: 'email',
		format: '.*',
		widget: LinkWidget,
	},
	{
		name: 'elapsed-date-time',
		format: '.*',
		widget: ElapsedTimeWidget,
	},
	...[
		ArrayWidget,
		BadgeWidget,
		ButtonGroupWidget,
		ButtonWidget,
		CheckboxWidget,
		ColorWidget,
		DropDownButtonWidget,
		HeadingWidget,
		HighlightedNameWidget,
		ImgWidget,
		LinkWidget,
		ListWidget,
		ObjectWidget,
		ProgressBarWidget,
		TagWidget,
		TxtWidget,
	].map((widget) => ({
		name: widget.displayName,
		format: '.*',
		widget: widget.uiOptions
			? withOptionProps(widget.uiOptions)(widget)
			: widget,
	})),
];

export const typeWidgets: Widgets = {
	object: ObjectWidget,
	string: TxtWidget,
	null: TxtWidget,
	integer: TxtWidget,
	number: TxtWidget,
	boolean: TxtWidget,
	array: ArrayWidget,
	default: TxtWidget,
};
