import React, { useState } from 'react';
import { useSettings } from './useSettings.tsx';
import PlaceSelector from './PlaceSelector.tsx';
import Place from './Place.ts';
import usePlace from './usePlace.ts';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { limit, placeId, radiusKm, setLimit, setPlaceId, setRadiusKm } =
        useSettings();
    const [selectedLimit, setSelectedLimit] = useState(limit);
    const [selectedRadius, setSelectedRadius] = useState(radiusKm);

    const { data: place } = usePlace(placeId);
    const [selectedPlace, setSelectedPlace] = useState<Place | undefined>(
        place
    );

    const handleSave = React.useCallback(() => {
        if (!selectedLimit || !selectedRadius || !selectedPlace) return;

        setLimit(selectedLimit);
        setRadiusKm(selectedRadius);
        setPlaceId(selectedPlace?.id.toString());
        onClose();
    }, [
        selectedLimit,
        selectedRadius,
        selectedPlace,
        setLimit,
        setRadiusKm,
        setPlaceId,
        onClose,
    ]);

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

                <div
                    style={{
                        marginTop: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <button onClick={onClose}>Cancel</button>
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
