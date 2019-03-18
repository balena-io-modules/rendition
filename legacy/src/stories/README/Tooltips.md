# Tooltips

Tooltips can be added to a supported component using the `tooltip` attribute.
For example, to add a tooltip to a `Button` component you would do the
following:

```
<Button
  tooltip='I am a tooltip'
>
  Click me
</Button>
```

If the `tooltip` attribute is a string then a tooltip containing the strings
content will be displayed above the component.

If you need more control over the tooltip, you can set the attribute to an
object with the following properties:

| Name          | Type      | Required | Description                                          |
| ------------- | --------- | -------- | ---------------------------------------------------- |
| text         | `string`  | ✓ | The text to display in the tooltip |
| trigger | <code>'click' &#124; 'hover'</code> | - | Controls whether the tooltip is displayed on hover or click, defaults to `'hover'`
| placement | <code>'top' &#124; 'right' &#124; 'bottom' &#124; 'left'</code> | - | Controls the position of the tooltip related to the component, defaults to `'top'` |
| containerStyle | `object` | - | Apply custom styles to the tooltip outer container, the object is applied as a [`style` attribute](https://reactjs.org/docs/dom-elements.html#style) |
| innerStyle | `object` | - | Apply custom styles to the tooltip inner container, the object is applied as a [`style` attribute](https://reactjs.org/docs/dom-elements.html#style) |
| arrowStyle | `object` | - | Apply custom styles to the tooltip arrow, the object is applied as a [`style` attribute](https://reactjs.org/docs/dom-elements.html#style) |

The following rendition components support the `tooltip` attribute:

- `Alert`
- `Badge`
- `BadgeSelect`
- `Box`
- `Button`
- `CodeWithCopy`
- `DropDownButton`
- `Fixed`
- `Flex`
- `Heading`
- `Txt`
- `Link`

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Tooltip.js)
