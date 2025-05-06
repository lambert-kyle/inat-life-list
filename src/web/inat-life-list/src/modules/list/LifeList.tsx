import React from 'react';
import { useTopSpecies } from '../observations/useTopSpecies.ts';
import { useSettings } from '../settings/useSettings.tsx';
import { useUserObservations } from '../observations/useUserObservations.ts';
import useUser from '../settings/user/useUser.ts';

export const LifeList = (): React.ReactElement => {
    const { latitude, limit, longitude, radiusKm, userId } = useSettings();

    const {
        data: topSpecies,
        error: topSpeciesError,
        isLoading: topSpeciesLoading,
    } = useTopSpecies({
        lat: latitude,
        lng: longitude,
        radius: radiusKm,
        limit,
    });

    const {
        data: userTaxa,
        error: userObservationsError,
        isLoading: userObservationsLoading,
    } = useUserObservations(userId);

    const isLoading = topSpeciesLoading || userObservationsLoading;

    React.useEffect(() => {
        console.log({ latitude, limit, longitude, radiusKm, userId });
    }, [latitude, limit, longitude, radiusKm, userId]);
    const { data: user } = useUser(userId);

    const results = React.useMemo(
        () =>
            topSpecies?.map((species) => ({
                id: species.id,
                scientificName: species.name,
                commonName: species.preferred_common_name,
                observationsCount: species.observations_count,
                photoUrl: species.default_photo?.square_url,
                seen: userTaxa?.has(species.id),
                iNatLink: `https://www.inaturalist.org/taxa/${species.id}`,
            })),
        [topSpecies, userTaxa]
    );

    const paramsAreMissing =
        !limit || !radiusKm || !latitude || !longitude || !userId;

    return (
        <>
            {' '}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <h1>iNaturalist Life List</h1>
            </div>
            {paramsAreMissing && 'Choose a location and user in the side bar!'}
            {!paramsAreMissing && (
                <span
                    style={{
                        padding: '0.5em',
                        margin: '0.5em',
                    }}
                >
                    Showing top {limit} species within {radiusKm} km of (
                    {latitude?.toFixed(2)}, {longitude?.toFixed(2)}) and whether{' '}
                    {user?.login} has observed them
                </span>
            )}
            {isLoading && <p>Loading...</p>}
            {topSpeciesError && (
                <p>Error loading top species: {topSpeciesError.message}</p>
            )}
            {userObservationsError && (
                <p>
                    Error loading user observations:{' '}
                    {userObservationsError.message}
                </p>
            )}
            {!isLoading && (
                <table>
                    <thead>
                        <tr>
                            <th>📸</th>
                            <th>Name</th>
                            <th>Observation Count</th>
                            <th>Seen?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results?.map((species) => (
                            <tr key={species.id}>
                                <td>
                                    {species.photoUrl ? (
                                        <a
                                            href={species.iNatLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                textDecoration: 'none',
                                                color: 'inherit',
                                            }}
                                        >
                                            <img
                                                src={species.photoUrl}
                                                alt={
                                                    species.commonName ||
                                                    species.scientificName
                                                }
                                                width="50"
                                                height="50"
                                            />
                                        </a>
                                    ) : (
                                        'N/A'
                                    )}
                                </td>
                                <td>
                                    <a
                                        href={species.iNatLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            textDecoration: 'none',
                                            color: 'inherit',
                                        }}
                                    >
                                        {species.commonName ? (
                                            <>
                                                {species.commonName}
                                                <br />
                                            </>
                                        ) : (
                                            ''
                                        )}
                                        <i style={{ paddingLeft: '0.25em' }}>
                                            {species.scientificName}
                                        </i>
                                    </a>
                                </td>
                                <td>{species.observationsCount}</td>
                                <td>
                                    {species.seen ? '✅ Seen' : '❌ Not Seen'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
};

export default LifeList;
