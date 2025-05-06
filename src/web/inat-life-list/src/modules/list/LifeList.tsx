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
                iconicName: species.iconic_taxon_name,
                ancestorIds: species.ancestor_ids,
            })),
        [topSpecies, userTaxa]
    );

    const [sortBy, setSortBy] = React.useState<
        'observationCount' | 'seen' | 'taxon'
    >('observationCount');

    const sortedResults = React.useMemo(() => {
        if (!results) return [];
        return [...results].sort((a, b) => {
            if (sortBy === 'observationCount') {
                return b.observationsCount - a.observationsCount;
            } else if (sortBy === 'seen') {
                return a.seen === b.seen ? 0 : a.seen ? 1 : -1;
            } else if (sortBy === 'taxon') {
                const aAncestors = a.ancestorIds || [];
                const bAncestors = b.ancestorIds || [];
                // Compare ancestor IDs sequentially
                for (
                    let i = 0;
                    i < Math.min(aAncestors.length, bAncestors.length);
                    i++
                ) {
                    if (aAncestors[i] !== bAncestors[i]) {
                        return aAncestors[i] - bAncestors[i];
                    }
                }

                // If one is a subset of the other, the shorter one comes first
                return aAncestors.length - bAncestors.length;
            }
            return 0;
        });
    }, [results, sortBy]);

    const paramsAreMissing =
        !limit || !radiusKm || !latitude || !longitude || !userId;

    return (
        <div>
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
            {/* Sort By Dropdown */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: '1rem',
                }}
            >
                <label
                    htmlFor="sortBy"
                    style={{ marginRight: '0.5rem', fontWeight: 'bold' }}
                >
                    Sort by:
                </label>
                <select
                    id="sortBy"
                    value={sortBy}
                    onChange={(e) =>
                        setSortBy(
                            e.target.value as
                                | 'observationCount'
                                | 'seen'
                                | 'taxon'
                        )
                    }
                    style={{
                        padding: '0.5rem',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    <option value="observationCount">Observation Count</option>
                    <option value="seen">Seen</option>
                    <option value="taxon">Taxon</option>
                </select>
            </div>
            {!isLoading && (
                <ul
                    style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                    }}
                >
                    {sortedResults?.map((r) => (
                        <li
                            key={r.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                // marginBottom: '1rem',
                                padding: '0.25rem',
                            }}
                        >
                            <div
                                style={{
                                    marginRight: '1rem',
                                    textAlign: 'center',
                                    width: '3em',
                                }}
                            >
                                {r.seen && (
                                    <>
                                        {user?.icon_url ? (
                                            <a
                                                href={`https://www.inaturalist.org/users/${user.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                <img
                                                    src={user.icon_url}
                                                    alt={user.name}
                                                    width="40"
                                                    height="40"
                                                    style={{
                                                        borderRadius: '50%',
                                                        cursor: 'pointer',
                                                    }}
                                                />
                                            </a>
                                        ) : (
                                            <div
                                                style={{
                                                    fontSize: 'x-large',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                ✅
                                            </div>
                                        )}
                                    </>
                                )}
                                {!r.seen && (
                                    <div
                                        style={{
                                            fontSize: 'x-large',
                                            textAlign: 'center',
                                        }}
                                    ></div>
                                )}
                            </div>
                            <div
                                style={{
                                    flex: 1,
                                    cursor: 'pointer',
                                    border: r.seen
                                        ? '2px solid rgb(76 162 0)'
                                        : '1px solid #e0e0e0',
                                    backgroundColor: r.seen
                                        ? 'rgba(0, 255, 50, 0.1)'
                                        : 'transparent',
                                    transition:
                                        'background-color 0.3s, border 0.3s',
                                    padding: '0.5rem',
                                    borderRadius: '15px',
                                    paddingLeft: '1rem',
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.color = '#007bff')
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.color = 'inherit')
                                }
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
                                                r.commonName || r.scientificName
                                            }
                                            width="60"
                                            height="60"
                                            style={{
                                                borderRadius: '5px',
                                                marginRight: '1em',
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                marginRight: '1em',
                                                backgroundColor: '#f0f0f0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '4px',
                                            }}
                                        >
                                            N/A
                                        </div>
                                    )}
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                        }}
                                    >
                                        <div>
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
                                                    fontFamily: 'system-ui',
                                                    fontStyle: 'italic',
                                                    fontSize: '0.9em',
                                                }}
                                            >
                                                {r.scientificName}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                gap: '0.5rem',
                                                marginTop: '0.5rem',
                                            }}
                                        >
                                            {r.iconicName && (
                                                <div
                                                    style={{
                                                        backgroundColor:
                                                            'rgba(255, 165, 0, 0.2)',
                                                        color: '#FF8C00',
                                                        padding:
                                                            '0.2rem 0.5rem',
                                                        borderRadius: '12px',
                                                        fontSize: '0.8em',
                                                        fontWeight: 'bold',
                                                        textTransform:
                                                            'uppercase',
                                                        height: '20px',
                                                    }}
                                                >
                                                    {r.iconicName}
                                                </div>
                                            )}
                                            <div
                                                style={{
                                                    backgroundColor: '#e7ebed',
                                                    color: 'darkslategrey',
                                                    padding: '0.2rem 0.5rem',
                                                    borderRadius: '5px',
                                                    fontSize: '0.8em',
                                                    fontWeight: 'bold',
                                                    height: '20px',
                                                }}
                                            >
                                                📸 {r.observationsCount}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LifeList;
