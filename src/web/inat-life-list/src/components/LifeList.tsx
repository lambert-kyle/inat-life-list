import React, { useState, useEffect } from 'react'
import { useTopSpecies } from '../hooks/fetchTopObservations.ts'
import SettingsModal from './SettingsModal'
import { useSearchParams } from 'react-router-dom'

const DEFAULT_PLACE_ID = 1292 // Erie County
const DEFAULT_LIMIT = 50

const getStoredConfig = (): { placeId: number; limit: number } => {
    const placeId = parseInt(localStorage.getItem('placeId') || '', 10)
    const limit = parseInt(localStorage.getItem('limit') || '', 10)
    return {
        placeId: isNaN(placeId) ? DEFAULT_PLACE_ID : placeId,
        limit: isNaN(limit) ? DEFAULT_LIMIT : limit,
    }
}

export const LifeList = (): React.ReactElement => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [settingsOpen, setSettingsOpen] = useState(false)

    const queryPlaceId = parseInt(searchParams.get('placeId') || '', 10)
    const queryLimit = parseInt(searchParams.get('limit') || '', 10)

    const { placeId: storedPlaceId, limit: storedLimit } = getStoredConfig()

    const [placeId, setPlaceId] = useState(
        isNaN(queryPlaceId) ? storedPlaceId : queryPlaceId
    )
    const [limit, setLimit] = useState(
        isNaN(queryLimit) ? storedLimit : queryLimit
    )

    const { data, error, isLoading } = useTopSpecies({ placeId, limit })

    const handleSaveSettings = (newPlaceId: number, newLimit: number) => {
        setPlaceId(newPlaceId)
        setLimit(newLimit)

        localStorage.setItem('placeId', newPlaceId.toString())
        localStorage.setItem('limit', newLimit.toString())

        setSearchParams({
            placeId: newPlaceId.toString(),
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
                Showing top {limit} species for place {placeId}
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
                defaultPlaceId={placeId}
                defaultLimit={limit}
            />
        </div>
    )
}

export default LifeList
