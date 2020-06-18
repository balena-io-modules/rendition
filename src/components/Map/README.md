# Map

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Map/story.js)

## Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| `apiKey`      | `string`                              | -     | ✓      | Google maps API key |
| `data`        | `any[]`                               | -     | ✓      | Passes the data that you wish to be used as a basis for rendering the map pins |
| `dataMap`     | `object`                              | -     | ✓      | A mapping object between your data and location-specific fields (like latitude) |
| `getIcon`     | `(entry: any) => string`              | -     | -      | Function that returns an icon based on the data entry |
| `onItemClick` | `(entry: any) => void`                | -     | -      | Callback function when an item on the map was clicked |
| `mapClick`    | `(e: google.maps.MouseEvent) => void` | -     | -      | Event triggered on map click that includes the clicked location's longitude and latitude |


