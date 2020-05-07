import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	Accordion as GrommetAccordion,
	AccordionPanel as GrommetAccordionPanel,
} from 'grommet';
import * as React from 'react';
import asRendition from '../../asRendition';
import { RenditionSystemProps, Theme } from '../../common-types';
import { getColor } from '../../utils';
import { Box } from '../Box';
import { Flex } from '../Flex';
import Txt from '../Txt';

const Accordion = (props: ThemedAccordionProps) => {
	const [openPanels, setOpenPanels] = React.useState<number[]>([]);
	const { items } = props;
	return (
		<GrommetAccordion
			activeIndex={openPanels}
			onActive={(opens) => setOpenPanels(opens)}
		>
			{items.map((item, index) => (
				<GrommetAccordionPanel
					header={
						<Flex alignItems="center" justifyContent="space-between">
							<Flex px={16}>
								<Txt my={24} fontSize={16} bold>
									{item.label}
								</Txt>
							</Flex>
							<Flex alignItems="center" justifyContent="flex-end" pr={16}>
								<FontAwesomeIcon
									color={getColor({ ...props, gray: true }, 'color', 'main')}
									icon={openPanels.includes(index) ? faMinus : faPlus}
								/>
							</Flex>
						</Flex>
					}
				>
					<Box px={16} mt={10} mb={24}>
						{item.panel}
					</Box>
				</GrommetAccordionPanel>
			))}
		</GrommetAccordion>
	);
};

interface ThemedAccordionProps extends InternalAccordionProps {
	theme: Theme;
}

interface InternalAccordionProps {
	children?: React.ComponentType;
	items: [{ label: string | React.ReactNode; panel: string | React.ReactNode }];
}

export type AccordionProps = InternalAccordionProps & RenditionSystemProps;
export default asRendition<React.FunctionComponent<AccordionProps>>(
	Accordion,
	[],
);
