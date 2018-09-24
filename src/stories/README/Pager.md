# Pager

Displays a pager widget.

[View story source](https://github.com/resin-io-modules/rendition/blob/master/src/stories/Pager.js)

## Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| `totalItems`  | `number`  | -         | -          | The total number of items to split into pages        |
| `itemsPerPage`| `number`  | -         | -          | The number of items on each page                     |
| `page`        | `number`  | -         | -          | The current page (zero-indexed)                      |
| `nextPage`    | `() => void` | -         | -          | Callback invoked when the "next page" button is clicked
| `prevPage`    | `() => void` | -         | -          | Callback invoked when the "previous page" button is clicked
