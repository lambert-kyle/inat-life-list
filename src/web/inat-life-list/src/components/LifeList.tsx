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
                <ul>
                    {data.map((species) => (
                        <li key={species.id}>
                            <h2>{species.name}</h2>
                            <p>{species.preferred_common_name}</p>
                            <p>{species.observations_count} observations</p>
                            {species.wikipedia_url && (
                                <a href={species.wikipedia_url}>Wikipedia</a>
                            )}
                            {/*{species.default_photo && (*/}
                            {/*    <img*/}
                            {/*        src={species.default_photo.thumb_url}*/}
                            {/*        alt={species.name}*/}
                            {/*    />*/}
                            {/*)}*/}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default LifeList
