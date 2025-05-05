import React, { useState, useEffect } from 'react';
import { useSettings } from './useSettings.tsx';
import PlaceSelector from './PlaceSelector.tsx';
import Place from './Place.ts';
import usePlace from './usePlace.ts';
import UserSelector from './UserSelector.tsx';
import User from './User.ts';
import useUser from './useUser.ts';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
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
    const [selectedLimit, setSelectedLimit] = useState(limit);
    const [selectedRadius, setSelectedRadius] = useState(radiusKm);

    const { data: place } = usePlace(placeId);
    const [selectedPlace, setSelectedPlace] = useState<Place | undefined>(
        place
    );

    const { data: user } = useUser(userId);
    const [selectedUser, setSelectedUser] = useState<User | undefined>(user);

    // Synchronize selectedPlace with the fetched place data
    useEffect(() => {
        setSelectedPlace(place);
    }, [place]);

    // Synchronize selectedUser with the fetched user data
    useEffect(() => {
        setSelectedUser(user);
    }, [user]);

    const handleSave = React.useCallback(() => {
        if (
            !selectedLimit ||
            !selectedRadius ||
            !selectedPlace ||
            !selectedUser
        )
            return;

        setLimit(selectedLimit);
        setRadiusKm(selectedRadius);
        setUserId(selectedUser.id);
        setPlaceId(selectedPlace?.id.toString());
        onClose();
    }, [
        selectedLimit,
        selectedRadius,
        selectedPlace,
        selectedUser,
        setLimit,
        setRadiusKm,
        setUserId,
        setPlaceId,
        onClose,
    ]);

    const handleCancel = React.useCallback(() => {
        setSelectedLimit(limit);
        setSelectedRadius(radiusKm);
        setSelectedPlace(place);
        setSelectedUser(user);
        onClose();
    }, [limit, onClose, place, radiusKm, user]);

    if (!isOpen) return null;
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: '#00000088',
                zIndex: 999,
            }}
        >
            <div
                style={{
                    background: 'white',
                    padding: '1rem',
                    margin: '10% auto',
                    width: '90%',
                    maxWidth: '600px',
                    borderRadius: '8px',
                }}
            >
                <h2>Settings</h2>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                        Limit (number of species):
                    </label>
                    <input
                        type="number"
                        value={selectedLimit}
                        onChange={(e) =>
                            setSelectedLimit(parseInt(e.target.value))
                        }
                        style={{
                            width: '55%',
                            padding: '0.5rem',
                            background: '#f5f5f5',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                        }}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                        Radius (km):
                    </label>
                    <input
                        type="number"
                        value={selectedRadius}
                        onChange={(e) =>
                            setSelectedRadius(parseInt(e.target.value))
                        }
                        style={{
                            width: '55%',
                            padding: '0.5rem',
                            background: '#f5f5f5',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                        }}
                    />
                </div>

                <PlaceSelector
                    place={selectedPlace}
                    setPlace={setSelectedPlace}
                />
                <UserSelector user={selectedUser} setUser={setSelectedUser} />

                <div
                    style={{
                        marginTop: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <button onClick={handleCancel}>Cancel</button>
                    <button
                        onClick={handleSave}
                        disabled={
                            !selectedLimit || !selectedRadius || !selectedPlace
                        }
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
