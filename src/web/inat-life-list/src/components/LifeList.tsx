import React, { useState } from 'react'
import { useTopSpecies } from '../hooks/fetchTopObservations.ts'
import SettingsModal from './SettingsModal'
import { useSearchParams } from 'react-router-dom'

const DEFAULT_LAT = 42.9 // example: Buffalo
const DEFAULT_LNG = -78.8
const DEFAULT_RADIUS = 25 // in km
const DEFAULT_LIMIT = 50

const getStoredConfig = (): {
    lat: number
    lng: number
    radius: number
    limit: number
} => {
    const lat = parseFloat(localStorage.getItem('lat') || '')
    const lng = parseFloat(localStorage.getItem('lng') || '')
    const radius = parseInt(localStorage.getItem('radius') || '', 10)
    const limit = parseInt(localStorage.getItem('limit') || '', 10)

    return {
        lat: isNaN(lat) ? DEFAULT_LAT : lat,
        lng: isNaN(lng) ? DEFAULT_LNG : lng,
        radius: isNaN(radius) ? DEFAULT_RADIUS : radius,
        limit: isNaN(limit) ? DEFAULT_LIMIT : limit,
    }
}

export const LifeList = (): React.ReactElement => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [settingsOpen, setSettingsOpen] = useState(false)

    const queryLat = parseFloat(searchParams.get('lat') || '')
    const queryLng = parseFloat(searchParams.get('lng') || '')
    const queryRadius = parseInt(searchParams.get('radius') || '', 10)
    const queryLimit = parseInt(searchParams.get('limit') || '', 10)

    const {
        lat: storedLat,
        lng: storedLng,
        radius: storedRadius,
        limit: storedLimit,
    } = getStoredConfig()

    const [lat, setLat] = useState(isNaN(queryLat) ? storedLat : queryLat)
    const [lng, setLng] = useState(isNaN(queryLng) ? storedLng : queryLng)
    const [radius, setRadius] = useState(
        isNaN(queryRadius) ? storedRadius : queryRadius
    )
    const [limit, setLimit] = useState(
        isNaN(queryLimit) ? storedLimit : queryLimit
    )

    const { data, error, isLoading } = useTopSpecies({
        lat,
        lng,
        radius,
        limit,
    })

    const handleSaveSettings = (
        newLat: number,
        newLng: number,
        newRadius: number,
        newLimit: number
    ) => {
        setLat(newLat)
        setLng(newLng)
        setRadius(newRadius)
        setLimit(newLimit)

        localStorage.setItem('lat', newLat.toString())
        localStorage.setItem('lng', newLng.toString())
        localStorage.setItem('radius', newRadius.toString())
        localStorage.setItem('limit', newLimit.toString())

        setSearchParams({
            lat: newLat.toString(),
            lng: newLng.toString(),
            radius: newRadius.toString(),
            limit: newLimit.toString(),
        })
        setSettingsOpen(false)
    }

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <h1>iNaturalist Life List</h1>
                <button onClick={() => setSettingsOpen(true)} title="Settings">
                    ⚙️
                </button>
            </div>
            <span>
                Showing top {limit} species within {radius} km of (
                {lat.toFixed(2)}, {lng.toFixed(2)})
            </span>

            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {data && (
                <table>
                    <thead>
                        <tr>
                            <th>📸</th>
                            <th>Scientific Name</th>
                            <th>Common Name</th>
                            <th>Observation Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((species) => (
                            <tr key={species.id}>
                                <td>
                                    {species.default_photo?.square_url ? (
                                        <img
                                            src={
                                                species.default_photo.square_url
                                            }
                                            alt={
                                                species.preferred_common_name ||
                                                species.name
                                            }
                                            width="50"
                                            height="50"
                                        />
                                    ) : (
                                        'N/A'
                                    )}
                                </td>
                                <td>
                                    <i>{species.name}</i>
                                </td>
                                <td>
                                    {species.preferred_common_name || 'N/A'}
                                </td>
                                <td>{species.observations_count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <SettingsModal
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                onSave={handleSaveSettings}
                defaultLat={lat}
                defaultLng={lng}
                defaultRadius={radius}
                defaultLimit={limit}
            />
        </div>
    )
}

export default LifeList
