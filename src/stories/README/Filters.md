# Filters

A component that can be used for generating filters in the form of [json schema](http://json-schema.org/) objects and saving sets of filters as "views".
The filters created by this component can be used to filter a collection of
objects using the `SchemaSieve` object.

[View story source](https://github.com/resin-io-modules/rendition/blob/master/src/stories/Filters.js)

## Schema

The `Filters` component requires a `schema` property which should be a json
schema that defines the shape of the objects you want to filter. For example if
you want to filter on a collection that looks like this:

```
[
  {
    name: 'Bulbasaur',
    caught: true,
  },
  {
    name: 'Pikachu',
    caught: true,
  },
  {
    name: 'Dratini',
    caught: false,
  }
]
```

You would define a schema that looks like this:

```
{
  type: 'object',
  properties: {
    name: {
      title: 'Name',
      type: 'string'
    },
    caught: {
      title: 'Has been caught',
      type: 'boolean'
    }
  }
}
```

If you provide a `title` property, it will be used to label the field when
filtering, otherwise the field name will be used.

### Views

Views represent a set of filters, along with an id and a name. This is a useful
feature for storing a set filters and loading it again at a later point.
A view can optionally have a `scope` property, which will correspond to the
`slug` of a view scope, if you have provided one in the `Filters` property
`viewScopes` property. Scopes allow you to easily add an extra layer of
granularity/grouping to views that are generated. If you provide view scopes,
the user can select a scope when creating a new view.

A view scope has the following properties:

| Name          | Type      | Description                                          |
| -------------------------------------------------------------------------------- |
| slug            | `string`  | A unique identifier for the scope                  |
| name          | `string`  | A descriptive name for the scope                     |
| label       | `string`  | An optional label to use for this scope when creating a view  |

A view has the following properties:

| Name          | Type      | Description                                          |
| -------------------------------------------------------------------------------- |
| id            | `string`  | A unique identifier for the view                     |
| name          | `string`  | A descriptive name for the view                      |
| filters       | `string`  | An array of json schemas                             |
| scope       | <code>string &#124; null</code>  | The slug of a view scope, or `null` if now scopes are provided |

## Props

| Name          | Type      | Default   | Required   | Description                                          |
| --------------------------------------------------------------------------------------------------------- |
| `schema`    | `object` | - | ✓ | A json schema describing the shape of the objects you want to filter |
| `disabled`    | `boolean` | -         | -          | If true, disable the entire `Filters` interface
| `filters`    | `object[]` | -         | -          | An array of json schemas to be displayed as the currently selected filters, typically used when loading when loading filters from storage |
| `views`    | `object[]` | -         | -          | An array of views, as described above, typically used when loading when loading views from storage |
| `viewScopes`    | `object[]` | - | - | An array of view scopes, as described above |
| `onFiltersUpdate`    | `(filters: object[]) => void` | - | - | A function that is called when filters are updated |
| `onViewsUpdate`    | `(views: object[]) => void` | - | - | A function that is called when views are updated |
| `addFilterButtonProps` | `object` | - | - | Properties that are passed to the "Add filter" button, these are the same props used for the [`Button`][1] component |
| `viewsMenuButtonProps` | `object` | - | - | Properties that are passed to the "Views" button, these are the same props used for the [`DropDownButton`][2] component |
| `renderMode` | <code>string &#124; string[]</code> | - | - | Controls which parts of the `Filters` interface are displayed. One of `all`, `add`, `search`, `views`, `summary`, or an array containing any of these values |
| `dark`    | `boolean` | -         | -          | If true, Set the `Filters` component against a dark background |

[1]: /?selectedKind=Button
[2]: /?selectedKind=DropDownButton



