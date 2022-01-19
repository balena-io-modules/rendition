import { AutoUIEntityPropertyDefinition } from '../../';
import { AutoUIContext, AutoUIModel } from '../../schemaOps';
import type { BoxProps } from '../../../../components/Box';
export { table } from './table';
export { entity } from './entity';

export interface LensRendererBaseProps<T> extends Pick<BoxProps, 'flex'> {
	properties: Array<AutoUIEntityPropertyDefinition<T>>;
	autouiContext: AutoUIContext<T>;
	model: AutoUIModel<T>;
	hasUpdateActions: boolean;
	onEntityClick: (
		entity: T,
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
	) => void;
}

export interface CollectionLensRendererProps<T>
	extends LensRendererBaseProps<T> {
	filtered: T[];
	selected: T[];
	changeSelected: (selected: T[]) => void;
	data: T[];
}

export interface EntityLensRendererProps<T> extends LensRendererBaseProps<T> {
	data: T;
}
