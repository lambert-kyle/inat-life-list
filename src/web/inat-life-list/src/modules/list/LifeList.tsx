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
                        <thead>
                            <tr>
                                <th
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '8px',
                                        placeItems: 'center',
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
                                        placeItems: 'center',
                                    }}
                                >
                                    Taxon
                                </th>
                                <th
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '8px',
                                        placeItems: 'center',
                                        textAlign: 'center',
                                    }}
                                >
                                    Community Observations
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {results?.map((r) => (
                                <tr>
                                    <td
                                        style={{
                                            border: '1px solid #ccc',
                                            placeItems: 'center',
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
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {r.photoUrl ? (
                                                <a
                                                    href={r.iNatLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        textDecoration: 'none',
                                                        color: 'inherit',
                                                        marginRight: '1em',
                                                    }}
                                                >
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
                                                        }}
                                                    />
                                                </a>
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
                                            <div style={{ marginLeft: '1em' }}>
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
                                            placeItems: 'center',
                                            textAlign: 'center',
                                            width: '7em',
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

interface TaxonCardProps {
    id: number;
    scientificName: string;
    commonName: string;
    photoUrl: string | undefined;
    iNatLink: string;
    seen: boolean | undefined;
    observationsCount: number;
}
const TaxonCard: React.FC<TaxonCardProps> = ({
    scientificName,
    commonName,
    photoUrl,
    iNatLink,
    seen,
    observationsCount,
}) => {
    return (
        <div
            style={{
                // border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                display: 'flex',
                flexDirection: 'row',
                position: 'relative', // Enable positioning for the badge
                gap: '2rem',
            }}
        >
            {/*/!* Badge *!/*/}
            {/*<div*/}
            {/*    style={{*/}
            {/*        position: 'absolute',*/}
            {/*        top: '5px',*/}
            {/*        left: '-20px',*/}
            {/*        // backgroundColor: seen ? '#4caf50' : '#f44336', // Green for seen, red for not seen*/}
            {/*        color: 'white',*/}
            {/*        borderRadius: '50%',*/}
            {/*        width: '30px',*/}
            {/*        height: '30px',*/}
            {/*        display: 'flex',*/}
            {/*        alignItems: 'center',*/}
            {/*        justifyContent: 'center',*/}
            {/*        fontSize: '20px',*/}
            {/*        fontWeight: 'bold',*/}
            {/*        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',*/}
            {/*    }}*/}
            {/*>*/}
            {/*    {seen ? '✅' : '❌'}*/}
            {/*</div>*/}
            <div
                style={{
                    height: '100%',
                    marginRight: '0.5rem',
                }}
            >
                {photoUrl ? (
                    <a
                        href={iNatLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                        }}
                    >
                        <img
                            src={photoUrl}
                            alt={commonName || scientificName}
                            width="50"
                            height="50"
                        />
                    </a>
                ) : (
                    'N/A'
                )}
            </div>
            <a
                href={iNatLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    textDecoration: 'none',
                    color: 'inherit',
                }}
            >
                {commonName ? (
                    <>
                        {commonName}
                        <br />
                    </>
                ) : (
                    ''
                )}
                <i
                    style={{
                        fontSize: 'small',
                    }}
                >
                    {scientificName}
                </i>
            </a>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    placeItems: 'center',
                    textAlign: 'center',
                }}
            >
                <span style={{ fontSize: 'larger' }}>📸</span>
                <span style={{ fontSize: 'smaller' }}>
                    {' '}
                    {observationsCount} community observations
                </span>
            </div>
        </div>
    );
};

export default LifeList;
