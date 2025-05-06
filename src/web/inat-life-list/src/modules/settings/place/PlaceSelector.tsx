import React, { CSSProperties, useEffect, useState } from 'react';
import Place from './Place.ts';

const fetchPlaces = async (query: string): Promise<Place[]> => {
    const url = new URL('https://api.inaturalist.org/v1/places/autocomplete');
    url.searchParams.set('q', query);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch places');
    const json = await res.json();
    return json.results.map((p: Place) => ({
        id: p.id,
        display_name: p.display_name,
        location: p.location,
    }));
};

export const PlaceSelector: React.FC<{
    place: Place | undefined;
    setPlace: (place: Place) => void;
    inputStyle?: CSSProperties;
}> = ({ place, setPlace, inputStyle }) => {
    const [placeQuery, setPlaceQuery] = useState(place?.display_name ?? '');
    const [placeResults, setPlaceResults] = useState<Place[]>([]);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (placeQuery.trim().length === 0) return;
        const timeoutId = setTimeout(() => {
            fetchPlaces(placeQuery).then(setPlaceResults).catch(console.error);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [placeQuery]);

    useEffect(() => {
        const displayName = place?.display_name;
        if (displayName && displayName !== placeQuery) {
            setPlaceQuery(place.display_name);
        }
    }, [place?.display_name, placeQuery]);

    return (
        <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Location:
            </label>
            <input
                type="text"
                value={placeQuery}
                placeholder={'Search for a place...'}
                onChange={(e) => setPlaceQuery(e.target.value)}
                onFocus={() => setShowResults(true)}
                onBlur={() => {
                    setTimeout(() => setShowResults(false), 200);
                }}
                style={{
                    ...inputStyle,
                    width: '90%',
                    padding: '0.5rem ',
                }}
            />
            {showResults && (
                <div style={{ padding: '.25em' }}>
                    <ul
                        style={{
                            backgroundColor: 'white',
                            border: '1px solid grey',
                            borderRadius: '4px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            listStyle: 'none',
                            marginTop: '0.5rem',
                            maxHeight: '150px',
                            overflowY: 'auto',
                            padding: 0,
                            position: 'absolute',
                            zIndex: 20,
                            width: '85%',
                        }}
                    >
                        {placeResults.length === 0 && (
                            <li
                                style={{
                                    padding: '0.5rem',
                                    textAlign: 'center',
                                }}
                            >
                                No matching places
                            </li>
                        )}
                        {placeResults.map((place) => (
                            <li
                                key={place.id}
                                style={{
                                    cursor: 'pointer',
                                    padding: '0.25rem 0',
                                }}
                                onClick={() => {
                                    setPlace(place);
                                    setPlaceQuery(place.display_name);
                                    setPlaceResults([]);
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem',
                                        borderRadius: '4px',
                                        transition: 'background-color 0.2s',
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.backgroundColor =
                                            '#f0f0f0')
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.backgroundColor =
                                            'transparent')
                                    }
                                >
                                    📍 {place.display_name}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PlaceSelector;
