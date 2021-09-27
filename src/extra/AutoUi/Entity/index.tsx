import React from "react";
import isEqual from "lodash/isEqual";

import {
	AutoUIAction,
	AutoUIContext,
	AutoUIModel,
	AutoUIBaseResource,
	getFieldForFormat,
} from "../schemaOps";
import styled from "styled-components";
import { Flex } from "../../../components/Flex";
import { ResourceTagModelService } from "../../../components/TagManagementModal/tag-management-service";
import { Spinner } from "../../../components/Spinner";
import { Format } from "../../../components/Renderer/types";
import { useTranslation } from "../../../hooks/useTranslation";
import { LensSelection } from "../Lenses/LensSelection";
import { getLenses, LensTemplate } from "../Lenses";
import { entity } from "../Lenses/types";
import { getFromLocalStorage, setToLocalStorage } from "../../../utils";
import { getColumnsFromSchema } from "../Collection/LensRenderer";

const HeaderGrid = styled(Flex)`
	margin-left: -4px;
	margin-right: -4px;

	> * {
		margin-left: 4px;
		margin-right: 4px;
	}
`;

export interface AutoUIEntityProps<T> {
	/** Model is the property that describe the data to display with a JSON structure */
	model: AutoUIModel<T>;
	/** Array of data to display */
	data: T | undefined;
	/** Formats are custom widgets to render in the table cell. The type of format to display is described in the model. */
	formats?: Format[];
	/** Actions is an array of actions applicable on the selected items */
	actions?: Array<AutoUIAction<T>>;
	/** The sdk is used to pass the method to handle tags when added removed or updated */
	sdk?: {
		tags?: ResourceTagModelService;
	};
	/** all the lenses available for this AutoUI component */
	customLenses?: LensTemplate[];
	lensContext?: object;
}

export const AutoUIEntity = <T extends AutoUIBaseResource<T>>({
	model: modelRaw,
	data,
	formats,
	actions,
	sdk,
	customLenses,
	lensContext,
}: AutoUIEntityProps<T>) => {
	const { t } = useTranslation();
	const modelRef = React.useRef(modelRaw);
	// This allows the collection to work even if
	// consumers are passing a new model object every time.
	const model = React.useMemo(() => {
		if (isEqual(modelRaw, modelRef.current)) {
			return modelRef.current;
		}
		return modelRaw;
	}, [modelRaw]);
	const defaultLensSlug =
		getFromLocalStorage(`${model.resource}__view_lens`) || "entity";

	const lenses = React.useMemo(
		() => getLenses(data, lensContext, customLenses),
		[data, customLenses]
	);

	const [lens, setLens] = React.useState<LensTemplate>(entity);

	React.useEffect(() => {
		const foundLens =
			lenses.find((lens) => lens.slug === defaultLensSlug) || entity;
		if (lens.slug === foundLens.slug) {
			return;
		}
		setLens(foundLens);
	}, [lenses]);

	const autouiContext = React.useMemo(
		() =>
			({
				resource: model.resource,
				idField: "id",
				nameField: model.priorities?.primary[0] ?? "id",
				tagField: getFieldForFormat(model.schema, "tag"),
				actions,
				sdk,
			} as AutoUIContext<T>),
		[model, actions, sdk]
	);

	const properties = React.useMemo(
		() =>
			getColumnsFromSchema<T>({
				schema: model.schema,
				idField: autouiContext.idField,
				tagField: autouiContext.tagField,
				priorities: model.priorities,
				formats,
			}),
		[
			model.schema,
			autouiContext.idField,
			autouiContext.tagField,
			model.priorities,
		]
	);

	const hasUpdateActions =
		!!autouiContext.actions?.filter((action) => action.type !== "create")
			?.length || !!autouiContext.sdk?.tags;

	return (
		<Flex>
			<Spinner
				label={t("loading.resource", {
					resource: t(`resource.${model.resource}_plural`).toLowerCase(),
				})}
				show={data == null}
			>
				{data && (
					<>
						{lenses.length > 1 && (
							<HeaderGrid>
								<LensSelection
									lenses={lenses}
									lens={lens}
									setLens={(lens) => {
										setLens(lens);
										setToLocalStorage(
											`${model.resource}__view_lens`,
											lens.slug
										);
									}}
								/>
							</HeaderGrid>
						)}
						<lens.data.renderer
							properties={properties}
							hasUpdateActions={hasUpdateActions}
							entity={data}
							autouiContext={autouiContext}
							model={model}
						/>
					</>
				)}
			</Spinner>
		</Flex>
	);
};
