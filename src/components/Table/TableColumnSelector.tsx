import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import styled from 'styled-components';
import clone from 'lodash/clone';
import reduce from 'lodash/reduce';
import without from 'lodash/without';
import filter from 'lodash/filter';
import { Divider, DividerProps } from '../Divider';
import { DropDownButton } from '../DropDownButton';

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
	cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
	color: ${(props) =>
		props.light || props.disabled ? props.theme.colors.text.light : 'inherit'};
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

const StyledDivider = styled(Divider)<DividerProps>`
	height: 1px;
	color: ${(props) => props.theme.colors.gray.main};
	margin: 8px 0;
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
	tagKeys?: string[];
}

export const TableColumnSelector = function <T extends TableColumnState>(
	props: TableColumnSelectorProps<T>,
) {
	const toggleSelectedColumn = (column: T) => {
		const columnIndex = props.columns.indexOf(column);
		if (columnIndex < 0) {
			return;
		}

		const columns = props.columns.slice();
		column = clone(column);
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

	const existingTagColumnKeys = reduce(
		props.columns,
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
			test: () => !(props.tagKeys || []).length,
			message: 'No tags available.',
		},
		{
			test: () => existingTagColumnKeys.includes(undefined),
			message: 'Unconfigured tag column already exists',
		},
		{
			test: () =>
				!without(props.tagKeys || [], ...existingTagColumnKeys).length,
			message: 'All tags used',
		},
	];

	const failedAddColumnRule = canAddColumnRules.find((rule) => rule.test());
	const canAddTagColumn = !failedAddColumnRule;
	const addTagColumnTitle = failedAddColumnRule && failedAddColumnRule.message;
	console.log(props.columns);

	return (
		<DropDownButton
			joined
			alignRight
			primary
			plain
			label={<SmallFontAwesomeIcon icon={faCog} />}
		>
			{filter(props.columns, (col) => !col.locked)
				.map((col) => (
					<Item
						key={col.key}
						light={!col.selected}
						onClick={(e) => {
							toggleSelectedColumn(col);
							e.preventDefault();
							e.stopPropagation();
						}}
					>
						<ItemIcon>
							{col.selected ? <FontAwesomeIcon icon={faCheck} /> : null}
						</ItemIcon>
						{col.type !== 'tag' ? (
							col.title
						) : (
							<span>
								<span>Tag :</span>{' '}
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
					!props.tagKeys
						? []
						: [
								<StyledDivider key="divider" />,
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
						  ],
				)}
		</DropDownButton>
	);
};
