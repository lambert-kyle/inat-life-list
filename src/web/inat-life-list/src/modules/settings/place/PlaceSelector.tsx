import React, { useEffect, useState } from 'react';
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
}> = ({ place, setPlace }) => {
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
                    width: '90%',
                    padding: '0.5rem ',
                    background: '#f5f5f5',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                }}
            />
            {showResults && (
                <div style={{ padding: '.25em' }}>
                    <ul
                        style={{
                            maxHeight: '150px',
                            overflowY: 'auto',
                            listStyle: 'none',
                            padding: 0,
                            marginTop: '0.5rem',
                        }}
                    >
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
                                → {place.display_name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PlaceSelector;
