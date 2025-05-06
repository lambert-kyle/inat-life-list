import React from 'react';
import { useQuery } from '@tanstack/react-query';

interface TaxonTagProps {
    iconicTaxonId: number;
}

const colorMap: Record<string, string> = {
    Plantae: 'rgba(0, 128, 0, 0.2)', // Green
    Aves: 'rgba(0, 0, 255, 0.2)', // Blue
    Insecta: 'rgba(128, 0, 128, 0.2)', // Purple
    Mammalia: 'rgba(255, 165, 0, 0.2)', // Orange
    Fungi: 'rgba(139, 69, 19, 0.2)', // Brown
    Reptilia: 'rgba(0, 128, 128, 0.2)', // Teal
    Amphibia: 'rgba(75, 0, 130, 0.2)', // Indigo
    Fish: 'rgba(0, 191, 255, 0.2)', // Light Blue
    Arachnida: 'rgba(255, 20, 147, 0.2)', // Deep Pink
    Unknown: 'rgba(128, 128, 128, 0.2)', // Gray
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
    // console.log('taxon.name ', taxon.name);

    return (
        <div
            style={{
                backgroundColor,
                color: backgroundColor.replace('0.2', '1'),
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
