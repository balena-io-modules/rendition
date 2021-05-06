import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import styled from 'styled-components';

const CaretButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0;
	border: 0 none;
	font-size: 16px;
	font-weight: normal;
	color: #b3b6b9;
	background-color: transparent;
`;

const CaretIconContainer = styled.span`
	font-size: 14px;
`;

export default ({
	isExpanded,
	onClick,
	children,
	className,
}: {
	isExpanded: boolean;
	onClick: () => void;
	children?: React.ReactNode;
	className?: string;
}) => (
	<CaretButton className={className} onClick={onClick}>
		<span>{children}</span>
		<CaretIconContainer style={{ marginLeft: children ? '4px' : 0 }}>
			{isExpanded ? (
				<FontAwesomeIcon icon={faCaretUp} />
			) : (
				<FontAwesomeIcon icon={faCaretDown} />
			)}
		</CaretIconContainer>
	</CaretButton>
);
