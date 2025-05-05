import React from 'react'
import { useTopSpecies } from '../hooks/fetchTopObservations.ts'

export const LifeList = (): React.ReactElement => {
    const placeId = 1292 // Erie county
    const limit = 50
    const results = useTopSpecies({ placeId, limit })
    const { data, error, isLoading } = results

    return (
        <div>
            <h1>iNaturalist Life List</h1>
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
        </div>
    )
}

export default LifeList
