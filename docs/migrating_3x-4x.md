# Migrating from v3.x to v4.x

Version 4 of Rendition includes many breaking changes. This document aims to
list these changes and provide a migration path for users wanting to upgrade.

## Tooltips
The tooltip component has been removed in v4. To add a tooltip to your
component, simply add the `tooltip` property to it.
The `tooltip` property can be either a string containing the tooltip text or an
options object.

| Option | Type | Description |
--- | --- | ---
text | string | The text displayted in the tooltip
trigger | 'hover' &#124; 'click' | The event used to display the tooltip, defaults to 'hover'
placement | 'top' &#124; 'right' &#124; 'bottom' &#124; 'left' | The position that the tooltip should be displayed

 
