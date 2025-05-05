import React from 'react';

export interface SettingsContextType {
    providerExists: boolean;
    latitude: number | undefined;
    limit: number | undefined;
    longitude: number | undefined;
    placeId: string | undefined;
    radiusKm: number | undefined;
    userId: number | undefined;
    setLatitude: (newValue: number) => void;
    setLimit: (newValue: number) => void;
    setLongitude: (newValue: number) => void;
    setPlaceId: (newValue: string | undefined) => void;
    setRadiusKm: (newValue: number) => void;
    setUserId: (newValue: number | undefined) => void;
}

const showError = (methodName: string) => {
    console.error(
        `Using the default implementation of SettingsContext.${methodName}. ` +
            'This means the context is being consumed outside of a valid ' +
            'provider, which is likely a bug.'
    );
};

export const SettingsContext = React.createContext<SettingsContextType>({
    providerExists: false,
    latitude: undefined,
    limit: undefined,
    longitude: undefined,
    placeId: undefined,
    radiusKm: undefined,
    userId: undefined,
    setLatitude: () => showError('setLatitude'),
    setLimit: () => showError('setLimit'),
    setLongitude: () => showError('setLongitude'),
    setPlaceId: () => showError('setPlaceId'),
    setRadiusKm: () => showError('setRadiusKm'),
    setUserId: () => showError('setUserId'),
});
