import { values } from 'lodash';
import ArrayWidget from './ArrayWidget';
import BadgeWidget from './BadgeWidget';
import ButtonGroupWidget from './ButtonGroupWidget';
import ButtonWidget from './ButtonWidget';
import CheckboxWidget from './CheckboxWidget';
import DropDownButtonWidget from './DropDownButtonWidget';
import HeadingWidget from './HeadingWidget';
import HighlightedNameWidget from './HighlightedNameWidget';
import ImgWidget from './ImgWidget';
import LinkWidget from './LinkWidget';
import ListWidget from './ListWidget';
import MarkdownWidget from './MarkdownWidget';
import ObjectWidget from './ObjectWidget';
import TagWidget from './TagWidget';
import TxtWidget from './TxtWidget';
import { JsonTypes } from '../types';
import { Widget, withOptionProps } from './widget-util';
export { WidgetWrapperUiOptions } from './ui-options';
export { getObjectPropertyNames } from './widget-util';
export { default as WidgetMeta } from './WidgetMeta';

type WidgetLookup = {
	[key: string]: Widget;
};

type Widgets = {
	[key: string]: WidgetLookup;
};

const widgets: Widgets = {};

values(JsonTypes).reduce((acc, jsonType) => {
	acc[jsonType] = {};
	return acc;
}, widgets);

const allWidgets: WidgetLookup = {};

[
	ArrayWidget,
	BadgeWidget,
	ButtonGroupWidget,
	ButtonWidget,
	CheckboxWidget,
	DropDownButtonWidget,
	HeadingWidget,
	HighlightedNameWidget,
	ImgWidget,
	LinkWidget,
	ListWidget,
	MarkdownWidget,
	ObjectWidget,
	TagWidget,
	TxtWidget,
].reduce((acc, widget) => {
	const widgetName = widget.name.replace(/Widget$/, '');
	const wrappedWidget = widget.uiOptions
		? withOptionProps(widget.uiOptions)(widget)
		: widget;
	acc[widgetName] = wrappedWidget;
	if (widget.supportedTypes) {
		widget.supportedTypes.forEach((jsonType) => {
			widgets[jsonType][widgetName] = wrappedWidget;
		});
	}
	return acc;
}, allWidgets);

widgets.object.default = allWidgets.Object;
widgets.string.default = allWidgets.Txt;
widgets.null.default = allWidgets.Txt;
widgets.integer.default = allWidgets.Txt;
widgets.number.default = allWidgets.Txt;
widgets.boolean.default = allWidgets.Checkbox;
widgets.array.default = allWidgets.Array;
widgets.default = {
	default: allWidgets.Txt,
};

export default widgets;
