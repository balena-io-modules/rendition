import { ThemeContext } from 'grommet/contexts/ThemeContext';
import React from 'react';
import { Theme } from '../common-types';

export const useTheme = () => {
	return React.useContext(ThemeContext) as Theme;
};
