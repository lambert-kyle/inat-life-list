import React, { useState, useEffect } from 'react'

interface PlaceResult {
    id: number
    display_name: string
}

interface SettingsModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (placeId: number, limit: number) => void
    defaultPlaceId: number
    defaultLimit: number
}

const fetchPlaces = async (query: string): Promise<PlaceResult[]> => {
    const url = new URL('https://api.inaturalist.org/v1/places/autocomplete')
    url.searchParams.set('q', query)
    const res = await fetch(url.toString())
    if (!res.ok) throw new Error('Failed to fetch places')
    const json = await res.json()
    return json.results.map((p: any) => ({
        id: p.id,
        display_name: p.display_name,
    }))
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    onSave,
    defaultPlaceId,
    defaultLimit,
}) => {
    const [limit, setLimit] = useState(defaultLimit)
    const [placeQuery, setPlaceQuery] = useState('')
    const [placeResults, setPlaceResults] = useState<PlaceResult[]>([])
    const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null)

    useEffect(() => {
        if (placeQuery.trim().length === 0) return
        const timeoutId = setTimeout(() => {
            fetchPlaces(placeQuery).then(setPlaceResults).catch(console.error)
        }, 300)
        return () => clearTimeout(timeoutId)
    }, [placeQuery])

    useEffect(() => {
        setLimit(defaultLimit)
        setSelectedPlace({
            id: defaultPlaceId,
            display_name: `Place ID ${defaultPlaceId}`,
        })
    }, [defaultLimit, defaultPlaceId])

    if (!isOpen) return null

    const handleSave = () => {
        if (limit <= 0 || !selectedPlace) return
        onSave(selectedPlace.id, limit)
    }

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: '#00000088',
            }}
        >
            <div
                style={{
                    background: 'white',
                    padding: '1rem',
                    margin: '10% auto',
                    width: '90%',
                    maxWidth: '400px',
                    borderRadius: '8px',
                }}
            >
                <h2>Settings</h2>

                <div>
                    <label>
                        Limit (number of species):
                        <input
                            type="number"
                            min="1"
                            value={limit}
                            onChange={(e) =>
                                setLimit(parseInt(e.target.value, 10) || 1)
                            }
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Location:
                        <input
                            type="text"
                            value={placeQuery}
                            placeholder="Search for a place..."
                            onChange={(e) => setPlaceQuery(e.target.value)}
                        />
                    </label>
                    <ul
                        style={{
                            maxHeight: '150px',
                            overflowY: 'auto',
                            listStyle: 'none',
                            padding: 0,
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
                                    setSelectedPlace(place)
                                    setPlaceQuery(place.display_name)
                                    setPlaceResults([])
                                }}
                            >
                                {place.display_name}
                            </li>
                        ))}
                    </ul>
                </div>

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
                        disabled={!selectedPlace || limit <= 0}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SettingsModal
