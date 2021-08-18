import React from 'react';
import { AutoUIBaseResource, AutoUIContext } from '../schemaOps';
import { UIMarker } from '../../../components/Map';
import { CollectionLenses } from './Lenses';

export const AutoUIMap = <T extends AutoUIBaseResource<T>>({
	data,
	getItemKey,
	getItemName,
	onItemClick,
	geolocationFields,
	mapComponent,
}: {
	data: T[];
	getItemKey: (item: T) => string | number;
	getItemName: (item: T) => string;
	onItemClick: AutoUIContext<T>['onRowClick'];
	geolocationFields: { latitudeField?: string; longitudeField?: string };
	mapComponent: (markers: UIMarker[]) => React.ReactNode;
}) => {
	if (!geolocationFields.longitudeField || !geolocationFields.latitudeField) {
		return null;
	}

	const markers = data
		.filter(
			(entry: any) =>
				!!(
					entry[geolocationFields.longitudeField!] &&
					entry[geolocationFields.latitudeField!]
				),
		)
		.map(
			(entry: any): UIMarker => ({
				id: getItemKey(entry),
				title: getItemName(entry),
				lat: entry[geolocationFields.latitudeField!],
				lng: entry[geolocationFields.longitudeField!],
				icon: entry.mapIcon,
				click: (entry) =>
					onItemClick?.(
						entry,
						{} as React.MouseEvent<HTMLAnchorElement, MouseEvent>,
						CollectionLenses.Map,
					),
			}),
		);

	return markers ? <>{mapComponent(markers)}</> : null;
};
