import React, { useState, useEffect } from 'react';
import { useSettings } from './useSettings.tsx';
import PlaceSelector from './place/PlaceSelector.tsx';
import Place from './place/Place.ts';
import usePlace from './place/usePlace.ts';
import UserSelector from './user/UserSelector.tsx';
import User from './user/User.ts';
import useUser from './user/useUser.ts';

const SettingsSidebar: React.FC = () => {
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
    const { data: user } = useUser(userId);

    const [selectedLimit, setSelectedLimit] = useState(limit);
    const [selectedRadius, setSelectedRadius] = useState(radiusKm);
    const [selectedPlace, setSelectedPlace] = useState<Place | undefined>(
        place
    );
    const [selectedUser, setSelectedUser] = useState<User | undefined>(user);
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        setSelectedPlace(place);
    }, [place]);

    useEffect(() => {
        setSelectedUser(user);
    }, [user]);

    const isDirty =
        selectedLimit !== limit ||
        selectedRadius !== radiusKm ||
        selectedPlace?.id !== placeId ||
        selectedUser?.id !== userId;

    const handleSave = () => {
        if (
            !selectedLimit ||
            !selectedRadius ||
            !selectedPlace ||
            !selectedUser
        )
            return;

        setLimit(selectedLimit);
        setRadiusKm(selectedRadius);
        setPlaceId(selectedPlace.id.toString());
        setUserId(selectedUser.id);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen((open) => !open)}
                style={{
                    position: 'fixed',
                    top: 10,
                    left: isOpen ? 290 : 10, // Adjust position based on sidebar state
                    zIndex: 1001,
                    background: '#f0f0f0',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '0.5rem',
                    transition: 'left 0.3s ease', // Smooth transition
                    height: '2em',
                    width: '2em',
                    alignItems: 'center',
                    display: 'flex',
                    fontSize: 'large',
                }}
                title={isOpen ? 'Hide Settings' : 'Show Settings'}
            >
                {/*{isOpen ? '🙈' : '🙉'}*/}
                {isOpen ? '⬅️' : '➡️'}
            </button>

            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: isOpen ? 0 : '-320px',
                    width: '300px',
                    height: '100%',
                    background: '#f0f0f0',
                    borderRight: '1px solid #ccc',
                    padding: '1rem',
                    overflowY: 'auto',
                    zIndex: 1000,
                    transition: 'left 0.3s ease',
                }}
            >
                <h2>Settings</h2>

                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="limit">Limit (number of species):</label>
                    <input
                        name="limit"
                        type="number"
                        value={selectedLimit}
                        onChange={(e) =>
                            setSelectedLimit(parseInt(e.target.value))
                        }
                        style={{ width: '15em', padding: '0.5rem' }}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="radius">Radius (km):</label>
                    <input
                        name="radius"
                        type="number"
                        value={selectedRadius}
                        onChange={(e) =>
                            setSelectedRadius(parseInt(e.target.value))
                        }
                        style={{ width: '15em', padding: '0.5rem' }}
                    />
                </div>

                <PlaceSelector
                    place={selectedPlace}
                    setPlace={setSelectedPlace}
                />
                <UserSelector user={selectedUser} setUser={setSelectedUser} />

                <button
                    onClick={handleSave}
                    disabled={!isDirty}
                    style={{
                        marginTop: '1rem',
                        width: '100%',
                        padding: '0.75rem',
                        background: isDirty ? '#007bff' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isDirty ? 'pointer' : 'not-allowed',
                    }}
                >
                    Save
                </button>
            </div>
        </>
    );
};

export default SettingsSidebar;
