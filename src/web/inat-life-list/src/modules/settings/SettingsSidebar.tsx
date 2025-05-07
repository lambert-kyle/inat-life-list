import React, { useState, useEffect } from 'react';
import Hamburger from 'hamburger-react';
import { useSettings } from './useSettings.tsx';
import PlaceSelector from './place/PlaceSelector.tsx';
import Place from './place/Place.ts';
import usePlace from './place/usePlace.ts';
import UserSelector from './user/UserSelector.tsx';
import User from './user/User.ts';
import useUser from './user/useUser.ts';

interface SettingsSidebarProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
    isOpen,
    setIsOpen,
}) => {
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
        setIsOpen(false);
    };

    // Reset sidebar state when closing
    useEffect(() => {
        if (!isOpen) {
            setSelectedLimit(limit);
            setSelectedRadius(radiusKm);
            setSelectedPlace(place);
            setSelectedUser(user);
        }
    }, [isOpen, limit, radiusKm, place, user]);

    return (
        <>
            {/* Overlay for blur effect */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(189, 227, 255, 0.3)', // Semi-transparent overlay
                        backdropFilter: 'blur(5px)', // Blur effect
                        zIndex: 999, // Below the sidebar but above the rest of the page
                    }}
                    onClick={() => {
                        setIsOpen(false);
                    }} // Close sidebar when clicking outside
                ></div>
            )}
            <div
                style={{
                    position: isOpen ? 'fixed' : 'absolute', // Keep it relative to the sidebar
                    top: isOpen ? 10 : 5,
                    left: isOpen ? 280 : 0, // Adjust position based on sidebar state
                    padding: '0.5rem',
                    height: '2em',
                    width: '2em',
                    alignItems: 'center',
                    display: 'flex',
                    fontSize: 'large',
                    color: 'rgb(1 81 79)',
                    transition: 'left 0.3s ease', // Smooth transition
                    zIndex: 1001, // Ensure it stays above the sidebar
                }}
            >
                <Hamburger toggled={isOpen} toggle={setIsOpen} />
            </div>

            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: isOpen ? 0 : '-320px',
                    width: '300px',
                    height: '100%',
                    background: 'white',
                    overflowY: 'auto',
                    zIndex: 1000,
                    transition: 'left 0.3s ease',
                    padding: isOpen ? '1rem' : '0rem',
                }}
            >
                <h2 style={{ color: 'rgb(1 81 79)' }}>Settings</h2>

                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="limit">Limit (number of species):</label>
                    <br />
                    <input
                        name="limit"
                        type="number"
                        value={selectedLimit}
                        onChange={(e) =>
                            setSelectedLimit(parseInt(e.target.value))
                        }
                        style={{
                            width: '7em',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                        }}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="radius">Radius (km):</label>
                    <br />
                    <input
                        name="radius"
                        type="number"
                        value={selectedRadius}
                        onChange={(e) =>
                            setSelectedRadius(parseInt(e.target.value))
                        }
                        style={{
                            width: '7em',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                        }}
                    />
                </div>

                <PlaceSelector
                    place={selectedPlace}
                    setPlace={setSelectedPlace}
                    inputStyle={{
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                    }}
                />
                <UserSelector
                    user={selectedUser}
                    setUser={setSelectedUser}
                    inputStyle={{
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                    }}
                />

                <button
                    onClick={handleSave}
                    disabled={!isDirty}
                    style={{
                        marginTop: '1rem',
                        width: '100%',
                        padding: '0.75rem',
                        background: 'rgb(1 81 79)',
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
