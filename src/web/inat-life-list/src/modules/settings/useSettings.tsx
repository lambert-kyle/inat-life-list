import React from 'react';
import { SettingsContext, SettingsContextType } from './SettingsContext.tsx';

export const useSettings = (): SettingsContextType => {
    const c = React.useContext(SettingsContext);
    if (!c.providerExists) {
        throw new Error(
            'Warning: useSettings() is being called outside of a valid SettingsProvider. ' +
                'This will almost definitely cause bugs when trying to consume the context state.'
        );
    }
    return c;
};
