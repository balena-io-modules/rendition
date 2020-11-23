import * as React from 'react';
import { Box } from '../components/Box';
import { Button } from '../components/Button';
import { Popover, PopoverProps, PopoverOptions } from '../components/Popover';

export interface ConfirmOptions extends PopoverOptions {
	text: React.ClassicElement<any> | string;
}

interface ConfirmProps extends ConfirmOptions, Omit<PopoverProps, 'onDismiss'> {
	onOK: () => any;
	onCancel: () => any;
}

const Confirm = ({ text, onOK, onCancel, ...rest }: ConfirmProps) => {
	return (
		<Popover {...rest} onDismiss={onCancel}>
			<Box mx={2} mt={2} fontSize={3}>
				{text}
			</Box>
			<Box>
				<Button m={2} size="small" onClick={onCancel}>
					Cancel
				</Button>
				<Button m={2} size="small" primary onClick={onOK}>
					OK
				</Button>
			</Box>
		</Popover>
	);
};

/*
 * Creates a proxy ref. This is usable in forwardRef when original ref is undefined or function
 */
export const useForwardedRef = <T extends {}>(
	ref: ((instance: T | null) => void) | React.MutableRefObject<T | null> | null,
) => {
	const innerRef = React.useRef<T>(null);

	React.useEffect(() => {
		if (!ref) {
			return;
		}

		if (typeof ref === 'function') {
			ref(innerRef.current);
		} else {
			ref.current = innerRef.current;
		}
	});

	return innerRef;
};

interface BaseProps<T> {
	onClick: (e: React.SyntheticEvent<T>) => any;
}

interface ForwardedComponentProps<T> {
	confirmation: ConfirmOptions | string;
	onClick: (e: React.SyntheticEvent<T>) => any;
}

export function withConfirm<T extends {}>(
	Base: React.ForwardRefExoticComponent<BaseProps<T> & React.RefAttributes<T>>,
) {
	return React.forwardRef<T, ForwardedComponentProps<T>>(
		({ onClick, confirmation, ...rest }, ref) => {
			const targetRef = useForwardedRef(ref);
			const [
				clickEvent,
				setClickEvent,
			] = React.useState<React.SyntheticEvent<T> | null>(null);

			const handleOk = React.useCallback(() => {
				if (onClick) {
					onClick(clickEvent!);
				}
				setClickEvent(null);
			}, [onClick, clickEvent]);

			const handleCancel = React.useCallback(() => {
				setClickEvent(null);
			}, []);

			const handleBaseClick = React.useCallback((e) => {
				setClickEvent(e);
			}, []);

			const confirmOptions = React.useMemo(() => {
				return typeof confirmation === 'string'
					? {
							text: confirmation,
					  }
					: confirmation;
			}, [confirmation]);

			return (
				<>
					{clickEvent && (
						<Confirm
							{...confirmOptions}
							target={targetRef.current!}
							onOK={handleOk}
							onCancel={handleCancel}
						/>
					)}
					<Base {...rest} ref={targetRef} onClick={handleBaseClick} />
				</>
			);
		},
	);
}
