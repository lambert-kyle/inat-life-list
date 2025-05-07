import React from 'react';
import { useQuery } from '@tanstack/react-query';

interface TaxonTagProps {
    iconicTaxonId: number;
}

const colorMap: Record<string, string> = {
    Amphibia: 'rgb(39 153 155 / 89%)',
    Arachnida: 'rgba(139, 0, 69, 0.8)',
    Aves: 'rgb(17 99 179 / 80%)',
    Fish: 'rgba(0, 104, 139, 0.8)',
    Fungi: 'rgba(101, 67, 33, 0.8)',
    Insecta: 'rgb(117 73 229 / 98%)',
    Mammalia: 'rgb(249 137 0 / 90%)',
    Plantae: 'rgb(0 119 0 / 80%)',
    Reptilia: 'rgb(131 65 9 / 80%)',
    Unknown: 'rgba(64, 64, 64, 0.8)',
};

const emojiMap: Record<string, string> = {
    Amphibia: '🐸',
    Arachnida: '🕷️',
    Aves: '🐦',
    Fish: '🐠',
    Fungi: '🍄',
    Insecta: '🐛',
    Mammalia: '🐾',
    Plantae: '🌱',
    Reptilia: '🐍',
    Unknown: '❓',
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

    const borderColor = colorMap[taxon.name] || colorMap['Unknown'];

    return (
        <div
            style={{
                border: `3px solid ${borderColor}`, // Circular border
                backgroundColor: 'transparent', // Transparent background
                color: borderColor, // Match text color to border
                width: '2.25rem', // Adjust size for larger emoji
                height: '2.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%', // Makes it circular
                fontSize: '1.25rem', // Larger emoji
                fontWeight: 'bold',
                textTransform: 'uppercase',
            }}
        >
            {emojiMap[taxon.name] || emojiMap['Unknown']}
        </div>
    );
};
export default TaxonTag;
