// components/SettingsBar.tsx
import React from 'react';
import { useSettings } from './useSettings.tsx';
import PlaceSelector from './place/PlaceSelector.tsx';
import UserSelector from './user/UserSelector.tsx';
import Place from './place/Place.ts';
import User from './user/User.ts';
import usePlace from './place/usePlace.ts';
import useUser from './user/useUser.ts';

const SettingsBar: React.FC = () => {
    const {
        limit,
        placeId,
        radiusKm,
        userId,
        setLimit,
        setPlaceId,
        setRadiusKm,
        setUserId,
    } = useSettings();

    const { data: place } = usePlace(placeId);
    const setPlace = React.useCallback(
        (place: Place | undefined) => {
            setPlaceId(place?.id.toString());
        },
        [setPlaceId]
    );
    const { data: user } = useUser(userId);
    const setUser = React.useCallback(
        (user: User | undefined) => {
            setUserId(user?.id);
        },
        [setUserId]
    );

    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                alignItems: 'center',
                padding: '1rem',
                borderBottom: '1px solid #ccc',
                backgroundColor: '#f9f9f9',
                position: 'sticky',
                top: 0,
                zIndex: 10,
            }}
        >
            <div>
                <label style={{ fontSize: '0.9rem' }}>
                    Limit:
                    <input
                        type="number"
                        value={limit}
                        onChange={(e) =>
                            setLimit(parseInt(e.target.value) || 0)
                        }
                        style={{
                            marginLeft: '0.5rem',
                            padding: '0.3rem',
                            width: '80px',
                        }}
                    />
                </label>
            </div>

            <div>
                <label style={{ fontSize: '0.9rem' }}>
                    Radius (km):
                    <input
                        type="number"
                        value={radiusKm}
                        onChange={(e) =>
                            setRadiusKm(parseInt(e.target.value) || 0)
                        }
                        style={{
                            marginLeft: '0.5rem',
                            padding: '0.3rem',
                            width: '80px',
                        }}
                    />
                </label>
            </div>

            <div style={{ position: 'relative' }}>
                <PlaceSelector place={place} setPlace={setPlace} />
            </div>

            <div style={{ position: 'relative' }}>
                <UserSelector user={user} setUser={setUser} />
            </div>
        </div>
    );
};

export default SettingsBar;
