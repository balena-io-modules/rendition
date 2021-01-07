import * as React from 'react';
import ReCaptcha from 'react-google-recaptcha';
import styled from 'styled-components';

const CenteredReCaptcha = styled(ReCaptcha)`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 12px;
`;

export interface CaptchaWidgetProps {
	onChange: (captchaResponse: string | null) => void;
	value?: boolean;
}

export class CaptchaWidget extends React.Component<CaptchaWidgetProps> {
	public static displayName = 'Captcha';

	public recaptchaRef: React.RefObject<any>;

	constructor(props: CaptchaWidgetProps) {
		super(props);
		this.recaptchaRef = React.createRef();
	}

	public componentDidMount() {
		// @ts-ignore If there is no recaptcha key, just set a dummy value so forms that require it will be filled-in.
		if (!window.RECAPTCHA_V2_API_KEY) {
			this.props.onChange('dummy');
		}
	}

	public componentDidUpdate(prevProps: CaptchaWidgetProps) {
		// Reset the captcha component if the form was submitted, since a captcha value can only be used once (and it will error if used again). The caller is obliged to empty the captcha value on submit
		if (prevProps.value !== this.props.value && !Boolean(this.props.value)) {
			this.recaptchaRef.current.reset();
		}
	}

	public componentDidCatch(error: Error) {
		console.error(error, 'The reCaptcha api key is invalid.');
	}

	public onChange = () => {
		const recaptchaValue = this.recaptchaRef.current.getValue();
		this.props.onChange(recaptchaValue);
	};

	public render() {
		// @ts-ignore Don't render and require recaptcha when the key doesn't exist.
		const captchaKey = window.RECAPTCHA_V2_API_KEY;
		if (!captchaKey) {
			return null;
		}

		return (
			<CenteredReCaptcha
				ref={this.recaptchaRef}
				onChange={this.onChange}
				sitekey={captchaKey}
			/>
		);
	}
}
