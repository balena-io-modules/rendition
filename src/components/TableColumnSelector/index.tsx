import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as _ from 'lodash';
import * as React from 'react';
import styled from 'styled-components';
import { Divider, DropDownButton, Theme } from '../../';

const SmallFontAwesomeIcon = styled(FontAwesomeIcon)`
	& {
		font-size: inherit !important;
	}
`;

const Item = styled.div<
	{ light?: boolean; disabled?: boolean } & React.HTMLProps<HTMLDivElement>
>`
	display: flex;
	align-items: center;
	justify-content: stretch;
	cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
	color: ${props =>
		props.light || props.disabled ? props.theme.colors.text.light : 'inherit'};
`;

const ItemIcon = styled.span`
	display: flex;
	height: 14px;
	width: 14px;
	margin-right: ${props => props.theme.space[2]}px;
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
	title: string;
	type: 'tag';
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
	tagKeys: string[];
}

export const TableColumnSelector = function<T extends TableColumnState>(
	props: TableColumnSelectorProps<T>,
) {
	const toggleSelectedColumn = (column: T) => {
		const columnIndex = props.columns.indexOf(column);
		if (columnIndex < 0) {
			return;
		}

		const columns = props.columns.slice();
		column = _.clone(column);
		column.selected = !column.selected;

		const shouldRemoveColumn = column.type === 'tag' && !column.selected;
		if (shouldRemoveColumn) {
			columns.splice(columnIndex, 1);
		} else {
			// replace the updated column object
			columns.splice(columnIndex, 1, column);
		}

		props.setColumns(columns);
	};

	const existingTagColumnKeys = _.reduce(
		props.columns,
		(acc, c) => {
			if (c.type === 'tag' && (c as TagTableColumnState).tagKey) {
				acc.push((c as TagTableColumnState).tagKey!);
			}
			return acc;
		},
		[] as string[],
	);

	const canAddColumnRules = [
		{
			test: () => !(props.tagKeys || []).length,
			message: 'No tags available',
		},
		{
			test: () => _.includes(existingTagColumnKeys, undefined),
			message: 'Unconfigured tag column already exists',
		},
		{
			test: () =>
				!_.without(props.tagKeys || [], ...existingTagColumnKeys).length,
			message: 'All tags used',
		},
	];

	const stopEvent = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const failedAddColumnRule = canAddColumnRules.find(rule => rule.test());

	const canAddTagColumn = !failedAddColumnRule;
	const addTagColumnTitle = failedAddColumnRule && failedAddColumnRule.message;

	return (
		<DropDownButton
			joined
			alignRight
			primary
			plain
			label={<SmallFontAwesomeIcon icon={faCog} />}
		>
			{_.filter(props.columns, col => !col.locked)
				.map(col => (
					<Item
						key={col.key}
						light={!col.selected}
						onClick={e => {
							toggleSelectedColumn(col);
							stopEvent(this.stopEvent(e));
						}}
					>
						<ItemIcon>
							{col.selected ? <FontAwesomeIcon icon={faCheck} /> : null}
						</ItemIcon>
						{col.type !== 'tag' ? (
							col.title
						) : (
							<span>
								<span>Tag:</span>{' '}
								{col.title ? (
									<strong>{col.title}</strong>
								) : (
									<span>Not set</span>
								)}
							</span>
						)}
					</Item>
				))
				.concat(
					<Divider
						key="divider"
						m="8px 0"
						style={{ height: 1 }}
						color={Theme.colors.gray.main}
					/>,
					<Item
						key="Add Tag Column"
						disabled={!canAddTagColumn}
						title={addTagColumnTitle}
						onClick={() => canAddTagColumn && props.addTagColumn()}
					>
						<ItemIcon>
							<FontAwesomeIcon icon={faPlus} />
						</ItemIcon>
						Add Tag Column
					</Item>,
				)}
		</DropDownButton>
	);
};
