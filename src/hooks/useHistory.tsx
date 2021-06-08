import React from 'react';
import { HistoryContext } from '../contexts/HistoryContext';

export const useHistory = () => {
	const history = React.useContext(HistoryContext);
	return history;
};
