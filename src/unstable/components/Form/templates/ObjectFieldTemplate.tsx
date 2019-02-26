import { Accordion, AccordionPanel } from 'grommet';
import * as React from 'react';
import { ObjectFieldTemplateProps } from 'react-jsonschema-form';
import { Heading } from '../../../../';

const ObjectFieldTemplate = (props: ObjectFieldTemplateProps) => {
	const { DescriptionField, idSchema } = props;

	// The `activeIndex` and `onActive` props are used to make the accordion
	// a controlled input, allowing the accordion to default to being open
	const [active, setActive] = React.useState(true);

	const toggleActive = () => setActive(!active);

	const title =
		props.schema.title && (props.uiSchema['ui:title'] || props.title)
			? `${props.title || props.uiSchema['ui:title']} ${
					props.required ? '*' : ''
			  }`
			: null;

	const content = (
		<>
			{props.description && (
				<DescriptionField
					id={`${props.idSchema.$id}__description`}
					description={props.description}
				/>
			)}

			{props.properties.map((prop: any) => prop.content)}
		</>
	);

	// Use the underscore seperation in the element Id as a heuristic for the
	// object depth
	// TODO: Update react-jsonschema-form to provide a "depth" prop to templates
	const depth = idSchema.$id.split('_').length;

	// As the depth increases, reduce the size of the header that is used
	let Head = Heading.h4;

	if (depth === 2) {
		Head = Heading.h5;
	} else if (depth > 2) {
		Head = Heading.h6;
	}

	// Only render content in an accordion if there is a usable title
	if (title) {
		return (
			<fieldset>
				<Accordion activeIndex={active ? [0] : []} onActive={toggleActive}>
					<AccordionPanel label={<Head>{title}</Head>}>
						{content}
					</AccordionPanel>
				</Accordion>
			</fieldset>
		);
	} else {
		return content;
	}
};

export default ObjectFieldTemplate;
