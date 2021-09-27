import React from "react";
import { DataGrid } from "../../../../components/DataGrid";
import { Card } from "../../../../components/Card";
import { TypeTemplate } from "..";
import { faTh } from "@fortawesome/free-solid-svg-icons/faTh";
import { Heading } from "../../../../components/Heading";
import { Flex } from "../../../../components/Flex";
import { Copy } from "../../../../components/Copy";
import { Txt } from "../../../../components/Txt";
import styled from "styled-components";

interface DataGridProps<T> {
	filtered: T[];
	columns: any[];
	onEntityClick?: (
		entity: T,
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
	) => void;
}

const ClickableWrapper = styled.a`
	color: inherit;
	cursor: pointer;
`;

export const grid: TypeTemplate = {
	slug: "grid",
	type: "lens",
	name: "Default grid lens",
	data: {
		label: "Grid",
		format: "grid",
		renderer: (props: DataGridProps<any>) => (
			<DataGrid<any>
				items={props.filtered}
				renderItem={(entity) => {
					const handleEntityClick = (
						e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
					) => {
						if (props.onEntityClick) {
							props.onEntityClick(entity, e);
						}
					};

					return (
						<ClickableWrapper onClick={(e) => handleEntityClick(e)}>
							<Card>
								<Heading.h3>
									<Flex flexDirection="row">
										{props.columns[0] &&
											typeof entity[props.columns[0].key] !== "object" && (
												<>
													<Flex
														flexDirection="column"
														display="block"
														maxWidth="90%"
													>
														<Txt truncate>
															{`${props.columns[0].key}: ${
																entity[props.columns[0].key]
															}`}
														</Txt>
													</Flex>
													<Flex flexDirection="column">
														<Copy
															content={entity[props.columns[0].key]}
															tooltip={entity[props.columns[0].key]}
														/>
													</Flex>
												</>
											)}
									</Flex>
								</Heading.h3>
								{props.columns.length > 1 && (
									<>
										<hr />
										<Flex flexDirection="row" justifyContent="space-between">
											<Flex flexDirection="column">
												<Heading.h4>
													{props.columns[1] &&
														typeof entity[props.columns[1].key] !== "object" &&
														`${props.columns[1].key}: ${
															entity[props.columns[1].key]
														}`}
												</Heading.h4>
											</Flex>
											<Flex flexDirection="column">
												<Heading.h4>
													{props.columns[2] &&
														typeof entity[props.columns[2].key] !== "object" &&
														`${props.columns[2].key}: ${
															entity[props.columns[2].key]
														}`}
												</Heading.h4>
											</Flex>
										</Flex>
									</>
								)}
								{props.columns.length > 3 && (
									<>
										<hr />
										<Flex flexDirection="row" justifyContent="space-between">
											<Flex flexDirection="column">
												<Heading.h5>
													{props.columns[3] &&
														typeof entity[props.columns[3].key] !== "object" &&
														`${props.columns[3].key}: ${
															entity[props.columns[3].key]
														}`}
												</Heading.h5>
											</Flex>
											<Flex flexDirection="column">
												<Heading.h5>
													{props.columns[4] &&
														typeof entity[props.columns[4].key] !== "object" &&
														`${props.columns[4].key}: ${
															entity[props.columns[4].key]
														}`}
												</Heading.h5>
											</Flex>
											<Flex flexDirection="column">
												<Heading.h5>
													{props.columns[5] &&
														typeof entity[props.columns[5].key] !== "object" &&
														`${props.columns[5].key}: ${
															entity[props.columns[5].key]
														}`}
												</Heading.h5>
											</Flex>
										</Flex>
									</>
								)}
							</Card>
						</ClickableWrapper>
					);
				}}
				getItemKey={(entity) => entity.id}
				itemMinWidth={"350px"}
			/>
		),
		icon: faTh,
		type: "*",
		filter: {
			type: "array",
			items: {
				type: "object",
				properties: {
					id: {
						type: "number",
					},
				},
			},
		},
	},
};
