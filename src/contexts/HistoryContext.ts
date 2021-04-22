import * as React from 'react';
import type { History } from 'history';

export const HistoryContext = React.createContext<History | null>(null);
