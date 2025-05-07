import React from 'react';
import TaxonTag from '../observations/TaxonTag.tsx';

export interface Species {
    id: number;
    scientificName: string;
    commonName?: string;
    iconicTaxonId?: number;
    observationsCount: number;
    photoUrl?: string;
    iNatLink: string;
    seen: boolean;
}
export interface LifeListProps {
    speciesList: Species[];
}

export const LifeList: React.FC<LifeListProps> = ({
    speciesList,
}): React.ReactElement => {
    return (
        <div>
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
                            minWidth: '345px',
                            maxWidth: '345px',
                            border: species.seen
                                ? '2px solid rgb(76 162 0)'
                                : '1px solid #e0e0e0',
                            backgroundColor: species.seen
                                ? 'rgba(0, 255, 50, 0.1)'
                                : 'transparent',
                            borderRadius: '8px',
                            padding: '0.5rem 0.5rem 0.5rem 0.75rem',
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
                                        marginRight: '0.6rem',
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        marginRight: '0.75rem',
                                        backgroundColor: '#f0f0f0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '4px',
                                    }}
                                >
                                    📸
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
