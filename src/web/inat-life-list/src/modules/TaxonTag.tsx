import React from 'react';
import { useQuery } from '@tanstack/react-query';

interface TaxonTagProps {
    iconicTaxonId: number;
}

const colorMap: Record<string, string> = {
    Plantae: 'rgba(0, 100, 0, 0.8)', // Dark Green
    Aves: 'rgba(0, 0, 139, 0.8)', // Dark Blue
    Insecta: 'rgba(75, 0, 130, 0.8)', // Dark Purple
    Mammalia: 'rgba(255, 140, 0, 0.8)', // Dark Orange
    Fungi: 'rgba(101, 67, 33, 0.8)', // Dark Brown
    Reptilia: 'rgba(0, 100, 100, 0.8)', // Dark Teal
    Amphibia: 'rgba(49, 0, 98, 0.8)', // Dark Indigo
    Fish: 'rgba(0, 104, 139, 0.8)', // Dark Light Blue
    Arachnida: 'rgba(139, 0, 69, 0.8)', // Dark Deep Pink
    Unknown: 'rgba(64, 64, 64, 0.8)', // Dark Gray
};

const fetchTaxonById = async (taxonId: number) => {
    const response = await fetch(
        `https://api.inaturalist.org/v1/taxa/${taxonId}`
    );
    if (!response.ok) {
        throw new Error(`Failed to fetch taxon with id ${taxonId}`);
    }
    const data = await response.json();
    return data.results[0];
};

const TaxonTag: React.FC<TaxonTagProps> = ({ iconicTaxonId }) => {
    const {
        data: taxon,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['taxon', iconicTaxonId],
        queryFn: () => fetchTaxonById(iconicTaxonId),
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error || !taxon) return <div>Error loading taxon</div>;

    const backgroundColor = colorMap[taxon.name] || colorMap['Unknown'];

    return (
        <div
            style={{
                backgroundColor,
                color: 'white', // White text
                padding: '0.2rem 0.5rem',
                borderRadius: '12px',
                fontSize: '0.8em',
                fontWeight: 'bold',
                textTransform: 'uppercase',
            }}
        >
            {taxon.preferred_common_name || taxon.name}
        </div>
    );
};

export default TaxonTag;
