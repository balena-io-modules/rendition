import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import styled from 'styled-components';
import clone from 'lodash/clone';
import reduce from 'lodash/reduce';
import without from 'lodash/without';
import { DropDownButton, DropdownOption } from '../DropDownButton';
import { Flex } from '../Flex';
import { stopEvent } from '../../utils';
import theme from '../../theme';
import { Txt } from '../Txt';

const SmallFontAwesomeIcon = styled(FontAwesomeIcon)`
	& {
		font-size: inherit !important;
	}
`;

const ItemIcon = styled.span`
	display: flex;
	height: 14px;
	width: 14px;
	margin-right: ${(props) => props.theme.space[2]}px;
	font-size: 13px;

	& svg {
		transform: translateY(-1px);
	}
`;

export interface TableColumnStateBase {
	title?: string;
	key: string;
	selected: boolean;
	locked?: boolean;
}

export interface PredefinedTableColumnState extends TableColumnStateBase {
	type?: 'predefined';
}

export interface TagTableColumnState extends TableColumnStateBase {
	title?: string;
	type?: 'tag';
	tagKey?: string;
}

export type TableColumnState = PredefinedTableColumnState | TagTableColumnState;

export const TableColumnStateStoredProps: Array<
	keyof PredefinedTableColumnState | keyof TagTableColumnState
> = ['key', 'selected', 'type', 'tagKey'];

export const getNewTagTableColumnState = (
	tagKey: string | undefined,
): TagTableColumnState => {
	if (tagKey) {
		return {
			title: tagKey,
			key: `tag_key: ${tagKey}`,
			selected: true,
			type: 'tag',
			tagKey,
		};
	}

	return {
		title: '',
		key: 'tag_key: Not Set',
		selected: true,
		type: 'tag',
		tagKey: undefined,
	};
};

interface TableColumnSelectorProps<T extends TableColumnState> {
	columns: T[];
	setColumns: (visibleColumns: T[]) => void;
	addTagColumn: () => void;
	tagKeys?: string[];
}

export const TableColumnSelector = function <T extends TableColumnState>(
	props: TableColumnSelectorProps<T>,
) {
	const { columns, tagKeys, addTagColumn, setColumns } = props;

	const toggleSelectedColumn = (column: T) => {
		const columnIndex = columns.indexOf(column);
		if (columnIndex < 0) {
			return;
		}

		const columnsCopy = columns.slice();
		column = clone(column);
		column.selected = !column.selected;

		const shouldRemoveColumn = column.type === 'tag' && !column.selected;
		if (shouldRemoveColumn) {
			columnsCopy.splice(columnIndex, 1);
		} else {
			// replace the updated column object
			columnsCopy.splice(columnIndex, 1, column);
		}

		setColumns(columnsCopy);
	};

	const existingTagColumnKeys = reduce(
		columns,
		(acc, c) => {
			if (c.type === 'tag' && (c as TagTableColumnState).tagKey) {
				acc.push((c as TagTableColumnState).tagKey!);
			}
			return acc;
		},
		[] as Array<string | undefined>,
	);

	const canAddColumnRules = [
		{
			test: () => !(tagKeys || []).length,
			message: 'No tags available.',
		},
		{
			test: () => existingTagColumnKeys.includes(undefined),
			message: 'Unconfigured tag column already exists',
		},
		{
			test: () => !without(tagKeys || [], ...existingTagColumnKeys).length,
			message: 'All tags used',
		},
	];

	const failedAddColumnRule = canAddColumnRules.find((rule) => rule.test());
	const canAddTagColumn = !failedAddColumnRule;
	const addTagColumnTitle = failedAddColumnRule && failedAddColumnRule.message;

	const memoizedItems = React.useMemo(() => {
		const items: DropdownOption[][] = [
			columns
				.filter((col) => !col.locked)
				.map((col) => ({
					content: (
						<Flex
							key={col.key}
							alignItems="center"
							color={!col.selected ? theme.colors.text.light : undefined}
						>
							<ItemIcon>
								{col.selected ? <FontAwesomeIcon icon={faCheck} /> : null}
							</ItemIcon>
							{col.type !== 'tag' ? (
								col.title
							) : (
								<Txt>
									Tag : {col.title ? <strong>{col.title}</strong> : 'Not set'}
								</Txt>
							)}
						</Flex>
					),
					onClick: (e) => {
						toggleSelectedColumn(col);
						stopEvent(e);
					},
				})),
		];

		if (tagKeys) {
			items.push([
				{
					content: (
						<Flex alignItems="center">
							<ItemIcon>
								<FontAwesomeIcon icon={faPlus} />
							</ItemIcon>
							{addTagColumnTitle ?? 'Add Tag Column'}
						</Flex>
					),
					onClick: () => canAddTagColumn && addTagColumn(),
					disabled: !canAddTagColumn,
				},
			]);
		}

		return items;
	}, [columns, tagKeys, addTagColumn]);

	return (
		<DropDownButton
			joined
			alignRight
			primary
			plain
			label={<SmallFontAwesomeIcon icon={faCog} />}
			items={memoizedItems}
		/>
	);
};
