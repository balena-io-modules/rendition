import * as React from 'react';
import uniq from 'lodash/uniq';
import styled from 'styled-components';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Filters, FiltersProps } from '.';
import { SchemaSieve, Tag } from '../..';
import PokeDex, { getNameFromSlug } from '../../stories/assets/pokedex';

const StyledTable = styled.table`
	width: 100%;

	td {
		border: 1px solid #eee;
		padding: 3px 6px;
	}
`;

const schema = {
	type: 'object',
	properties: {
		name: {
			title: 'Pokemon Name',
			type: 'string',
		},
		description: {
			type: 'string',
		},
		abilities: {
			type: 'array',
			items: {
				type: 'string',
			},
		},
		secondaryAbilities: {
			title: 'Secondary Abilities',
			type: 'array',
			items: {
				type: 'string',
				oneOf: [
					{
						title: 'Swimming',
						const: 'swimming',
					},
					{
						title: 'Fly',
						const: 'fly',
					},
					{
						title: 'Cut',
						const: 'cut',
					},
				],
			},
		},
		tag: {
			type: 'object',
			properties: {
				tag_name: {
					title: 'Name',
					description: 'key',
					type: 'string',
				},
				tag_value: {
					description: 'value',
					title: 'Value',
					type: 'string',
				},
			},
		},
		first_seen: {
			title: 'First Seen',
			type: 'string',
			format: 'date-time',
		},
		caught: {
			title: 'Has been caught',
			type: 'boolean',
		},
		biometrics: {
			type: 'object',
			description: '{"x-foreign-key-scheme": ["Height", "Weight"]}',
			properties: {
				Height: {
					title: 'Height',
					type: ['number', null],
				},
				Weight: {
					title: 'Weight',
					type: 'number',
				},
			},
		},
		pokedex_number: {
			title: 'National pokedex number',
			type: 'number',
		},
		category: {
			enum: uniq(PokeDex.map((p) => p.Category)),
		},
		nationality: {
			title: 'Nationality',
			type: 'string',
			oneOf: uniq(PokeDex.map((p) => p.nationality)).map((slug) => ({
				title: getNameFromSlug(slug),
				const: slug,
			})),
		},
	},
};

const FiltersDemo = (props: FiltersProps) => {
	const [filters, setFilters] = React.useState(props.filters ?? []);
	const [views, setViews] = React.useState(props.views ?? []);
	const items = React.useMemo(
		() => SchemaSieve.filter(filters, PokeDex),
		[filters],
	);

	return (
		<div>
			<Filters
				filters={filters}
				views={views}
				onFiltersUpdate={setFilters}
				onViewsUpdate={setViews}
				{...props}
			/>

			{/* TODO: Render a Table component (using the data schema ideally.) */}
			{items.map((item, index) => (
				<div key={index}>
					<h2>{item.Name}</h2>
					<StyledTable>
						<tbody>
							<tr>
								<td>National PokeDex Number</td>
								<td>{item.pokedex_number}</td>
							</tr>
							<tr>
								<td>Category</td>
								<td>{item.Category}</td>
							</tr>
							<tr>
								<td>Nationality</td>
								<td>{getNameFromSlug(item.nationality)}</td>
							</tr>
							<tr>
								<td>Height</td>
								<td>{item.biometrics.Height}</td>
							</tr>
							<tr>
								<td>Weight</td>
								<td>{item.biometrics.Weight}</td>
							</tr>
							<tr>
								<td>Abilities</td>
								<td>{item.Abilities.join(', ')}</td>
							</tr>
							<tr>
								<td>Secondary Abilities</td>
								<td>{item.secondaryAbilities.join(', ')}</td>
							</tr>
							<tr>
								<td>First Seen</td>
								<td>
									{item.first_seen
										? new Date(item.first_seen).toUTCString()
										: ''}
								</td>
							</tr>
							<tr>
								<td>Caught</td>
								<td>{item.caught ? 'yes' : 'no'}</td>
							</tr>
							<tr>
								<td>Tags</td>
								<td>
									{!!item.Tag &&
										(item.Tag as any[]).map((tag) => (
											<Tag key={tag.tag_name} value={tag.tag_value} />
										))}
								</td>
							</tr>
						</tbody>
					</StyledTable>
					<p>{item.Description}</p>
				</div>
			))}
		</div>
	);
};

export default {
	title: 'Core/Filters',
	component: Filters,
	args: {
		schema,
	},
} as Meta;

const Template = createTemplate<FiltersProps>(FiltersDemo);
export const DefaultCA = createStory<FiltersProps>(Template, {});

export const Disabled = createStory<FiltersProps>(Template, {
	filters: [],
	disabled: true,
});

export const ButtonProps = createStory<FiltersProps>(Template, {
	filters: [],
	addFilterButtonProps: {
		width: 200,
	},
	viewsMenuButtonProps: {
		width: 200,
		danger: true,
	},
});

export const Compact = createStory<FiltersProps>(Template, {
	filters: [],
	compact: [true],
});

export const RenderModes = createStory<FiltersProps>(Template, {
	filters: [
		{
			$id: 'FuELaSmfCBqiV9hx',
			anyOf: [
				{
					$id: 'QXe1ev3KzutxZ0lK',
					title: 'is',
					description:
						'{"name": "Pokemon Name", "operator": "is", "value": "Squirtle"}',
					type: 'object',
					properties: {
						Name: {
							title: 'Pokemon Name',
							const: 'Squirtle',
						},
					},
				},
				{
					$id: 'QXe1ev3KzutxZ0lm',
					title: 'is',
					description:
						'{"name": "Pokemon Name", "operator": "is", "value": "Pikachu"}',
					type: 'object',
					properties: {
						Name: {
							title: 'Pokemon Name',
							const: 'Pikachu',
						},
					},
				},
			],
		},
	],
	renderMode: ['add', 'views', 'summary'],
});
