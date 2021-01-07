import * as React from 'react';
import { Format } from '../components/Renderer/types';

export interface WidgetContextValue {
	form?: {
		formats: Format[];
	};
	renderer?: {
		formats: Format[];
	};
}

export const WidgetContext = React.createContext<WidgetContextValue>({});
