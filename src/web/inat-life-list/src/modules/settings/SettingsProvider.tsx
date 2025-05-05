import React from 'react';
import { SettingsContext, SettingsContextType } from './SettingsContext.tsx';
import usePersistedState from '../common/usePersistedState.ts';
import usePlace from './place/usePlace.ts';

export const SettingsProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [limit, setLimit] = usePersistedState<SettingsContextType['limit']>(
        'limit',
        50
    );
    const [placeId, setPlaceId] = usePersistedState<
        SettingsContextType['placeId']
    >('placeId', undefined);
    const [radiusKm, setRadiusKm] = usePersistedState<
        SettingsContextType['radiusKm']
    >('radiusKm', 50);
    const [userId, setUserId] = usePersistedState<
        SettingsContextType['userId']
    >('userId', undefined);

    // HACK to sync lat/lng from the data
    // Someday might replace with a maps integration that does genuine get/set of lat/lng
    const { data } = usePlace(placeId);
    const { lat, lng } = React.useMemo(() => {
        if (!data?.location) return { lat: undefined, lng: undefined };

        const [latStr, lngStr] = data.location.split(',');
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);
        if (isNaN(lat) || isNaN(lng)) return { lat: undefined, lng: undefined };

        return { lat, lng };
    }, [data]);

    const [latitude, setLatitude] =
        React.useState<SettingsContextType['latitude']>(lat);
    React.useEffect(() => {
        if (latitude !== lat) {
            setLatitude(lat);
        }
    }, [lat, latitude]);
    const [longitude, setLongitude] =
        React.useState<SettingsContextType['longitude']>(lng);
    React.useEffect(() => {
        if (longitude !== lng) {
            setLongitude(lng);
        }
    }, [lng, longitude]);

    return (
        <SettingsContext.Provider
            value={{
                providerExists: true,
                latitude,
                limit,
                longitude,
                placeId,
                radiusKm,
                userId,
                setLatitude,
                setLimit,
                setLongitude,
                setPlaceId,
                setRadiusKm,
                setUserId,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};
