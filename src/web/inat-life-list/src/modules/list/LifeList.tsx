import React from 'react';
import { useTopSpecies } from '../observations/useTopSpecies.ts';
import { useSettings } from '../settings/useSettings.tsx';
import { useUserObservations } from '../observations/useUserObservations.ts';
import TaxonTag from '../observations/TaxonTag.tsx';

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

    const speciesList = React.useMemo(() => {
        if (!topSpecies) return [];
        return topSpecies.map((species) => ({
            id: species.id,
            scientificName: species.name,
            commonName: species.preferred_common_name,
            observationsCount: species.observations_count,
            photoUrl: species.default_photo?.square_url,
            seen: userTaxa?.has(species.id),
            iNatLink: `https://www.inaturalist.org/taxa/${species.id}`,
            iconicTaxon: species.iconic_taxon_name || 'Unknown',
            iconicTaxonId: species.iconic_taxon_id,
        }));
    }, [topSpecies, userTaxa]);

    return (
        <div>
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

            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}
            >
                {speciesList.map((species) => (
                    <div
                        key={species.id}
                        style={{
                            flex: '1 1 calc(25% - 1rem)',
                            minWidth: '350px',
                            maxWidth: '350px',
                            border: species.seen
                                ? '2px solid rgb(76 162 0)'
                                : '1px solid #e0e0e0',
                            backgroundColor: species.seen
                                ? 'rgba(0, 255, 50, 0.1)'
                                : 'transparent',
                            borderRadius: '8px',
                            padding: '0.5rem 0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s, border 0.3s',
                        }}
                        onClick={() => window.open(species.iNatLink, '_blank')}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.color = '#007bff')
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.color = 'inherit')
                        }
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {species.photoUrl ? (
                                <img
                                    src={species.photoUrl}
                                    alt={
                                        species.commonName ||
                                        species.scientificName
                                    }
                                    width="50"
                                    height="50"
                                    style={{
                                        borderRadius: '4px',
                                        marginRight: '1rem',
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        marginRight: '1rem',
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
                            <div>
                                {species.commonName && (
                                    <div style={{ fontWeight: 'bold' }}>
                                        {species.commonName}
                                    </div>
                                )}
                                <div
                                    style={{
                                        fontFamily: 'system-ui',
                                        fontStyle: 'italic',
                                        fontSize: '0.9em',
                                    }}
                                >
                                    {species.scientificName}
                                </div>
                            </div>
                        </div>
                        {species.iconicTaxonId && (
                            <TaxonTag iconicTaxonId={species.iconicTaxonId} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LifeList;
