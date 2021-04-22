import * as React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../../hooks/useTheme';
import { Flex } from '../../../components/Flex';
import { Txt } from '../../../components/Txt';

const Left = styled.div`
	padding-left: 58px;
	padding-bottom: 16px;
	pointer-events: none;
`;

const ContentWrapper = styled(Flex)`
	pointer-events: none;
`;

export const NoRecordsFoundArrow = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const theme = useTheme();
	return (
		<Flex mt={-3}>
			<Left>
				<svg
					stroke={theme.colors.quartenary.main}
					fill={theme.colors.quartenary.main}
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 68 45"
					width="120px"
					version="1.0"
					preserveAspectRatio="xMidYMid meet"
				>
					<path
						d="M5,5 C10,40 55,40 68,42"
						transform="translate(0, 3)"
						fill="none"
						strokeDasharray="4, 4"
						strokeWidth="1"
						strokeLinejoin="round"
						strokeLinecap="round"
					/>
					<polygon
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="1"
						transform="translate(2, 1) rotate(-4)"
						points="2.5,0 5,5 0,5"
					/>
				</svg>
			</Left>
			<ContentWrapper ml={2} alignItems="flex-end">
				<Txt.span align="center" color="tertiary.light">
					{children}
				</Txt.span>
			</ContentWrapper>
		</Flex>
	);
};
