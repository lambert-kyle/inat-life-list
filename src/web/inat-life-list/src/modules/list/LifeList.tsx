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

    const { data: user } = useUser(userId);

    React.useEffect(() => {
        console.log({ latitude, limit, longitude, radiusKm, userId });
    }, [latitude, limit, longitude, radiusKm, userId]);

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
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            ></div>
            {paramsAreMissing && 'Choose a location and user in the side bar!'}

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
                <>
                    <table
                        style={{
                            borderCollapse: 'collapse',
                            width: '100%',
                            textAlign: 'left',
                        }}
                    >
                        <thead style={{ color: 'rgb(1 81 79)' }}>
                            <tr>
                                <th
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '8px',
                                        textAlign: 'center',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            height: '100%',
                                            width: '100%',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {user?.icon_url ? (
                                            <img
                                                src={user.icon_url}
                                                alt={user.name}
                                                width="50"
                                                height="50"
                                                style={{
                                                    borderRadius: '50%',
                                                }}
                                            />
                                        ) : (
                                            <span>{user?.login ?? ''}</span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '8px',
                                    }}
                                >
                                    Taxon
                                </th>
                                <th
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '8px',
                                        textAlign: 'center',
                                    }}
                                >
                                    Community Observations
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {results?.map((r) => (
                                <tr
                                    key={r.id}
                                    style={{
                                        backgroundColor: r.seen
                                            ? 'rgba(255, 255, 0, 0.2)' // Slight yellow highlight for seen rows
                                            : 'transparent',
                                        opacity: r.seen ? 0.6 : 1, // Fade rows with seen == true
                                        transition: 'opacity 0.3s',
                                    }}
                                >
                                    <td
                                        style={{
                                            border: '1px solid #ccc',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 'x-large',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {r.seen && '✅'}
                                        </div>
                                    </td>
                                    <td
                                        style={{
                                            border: '1px solid #ccc',
                                            padding: '8px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() =>
                                            window.open(r.iNatLink, '_blank')
                                        }
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {r.photoUrl ? (
                                                <img
                                                    src={r.photoUrl}
                                                    alt={
                                                        r.commonName ||
                                                        r.scientificName
                                                    }
                                                    width="50"
                                                    height="50"
                                                    style={{
                                                        borderRadius: '4px',
                                                        marginRight: '1em',
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        marginRight: '1em',
                                                        backgroundColor:
                                                            '#f0f0f0',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'center',
                                                        borderRadius: '4px',
                                                    }}
                                                >
                                                    N/A
                                                </div>
                                            )}
                                            <div
                                                style={{
                                                    marginLeft: '1em',
                                                    color: 'inherit',
                                                    textDecoration: 'none',
                                                    transition: 'color 0.3s',
                                                }}
                                                onMouseEnter={(e) =>
                                                    (e.currentTarget.style.color =
                                                        '#007bff')
                                                }
                                                onMouseLeave={(e) =>
                                                    (e.currentTarget.style.color =
                                                        'inherit')
                                                }
                                            >
                                                {r.commonName && (
                                                    <div
                                                        style={{
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        {r.commonName}
                                                    </div>
                                                )}
                                                <div
                                                    style={{
                                                        fontStyle: 'italic',
                                                        fontSize: '0.9em',
                                                    }}
                                                >
                                                    {r.scientificName}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td
                                        style={{
                                            border: '1px solid #ccc',
                                            textAlign: 'center',
                                            width: '7em',
                                            fontWeight: 'bold',
                                            color: '#28a745', // Prettier color for observations
                                        }}
                                    >
                                        {r.observationsCount}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default LifeList;
