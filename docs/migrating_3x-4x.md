# Migrating from v3.x to v4.x

Version 4 of Rendition includes some breaking changes. This document aims to
list these changes and provide a migration path for users wanting to upgrade.

## Dependency updates

The following dependencies have been updated to their latest versions:
- `react`
- `react-dom`
- `@types/react`
- `@types/react-dom`
- `grid-styled`
- `resin-semver`
- `styled-components`

## Tooltips

The tooltip component has been removed in v4. To add a tooltip to your
component, simply add the `tooltip` property to it.
The `tooltip` property can be either a string containing the tooltip text or an
options object.

| Option | Type | Description |
--- | --- | ---
text | string | The text displayed in the tooltip
trigger | 'hover' &#124; 'click' | The event used to display the tooltip, defaults to 'hover'
placement | 'top' &#124; 'right' &#124; 'bottom' &#124; 'left' | The position that the tooltip should be displayed

## Image

The `Image` component has been renamed to `Img` to prevent conflicts with the
`Image()` web API - https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image

## Text

The `Text` component has been renamed to `Txt` to prevent conflicts with the
`Text()` web API - https://developer.mozilla.org/en-US/docs/Web/API/Text

## Filters 
The `Semver` and `Semver Range` types have been removed
`SchemaSieve` is no longer a factory function, and its methods can be accessed
without instantiation.

```
import { SchemaSieve } from 'rendition';
const sieve = SchemaSieve();
// ...
sieve.filter(items, rules)
```

now becomes:

```
import { SchemaSieve } from 'rendition';
SchemaSieve.filter(filters, items)
```

Filters now use JSON schema (draft 6) for both schemas and rules.
Any views, schemas or filters created using v3 can be migrated using the
functions `migrateLegacyFilter()`, `migrateLegacyViews()` and
`migrateLegacySchema()` functions in the `SchemaSieve` object

The filters components now only requires a schema property to bootstrap. You can
be notified of filter and view changes using the `onFiltersUpdate` and
`onViewsUpdate` properties.
