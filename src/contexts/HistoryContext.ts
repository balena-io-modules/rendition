import React from 'react';
import type { History } from 'history';

export const HistoryContext = React.createContext<History>(
	{} as History<unknown>,
);
