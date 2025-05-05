import Place from './Place.ts';
import { useQuery } from '@tanstack/react-query';

async function fetchPlaceById(
    placeId: string | undefined
): Promise<Place | undefined> {
    if (!placeId) return undefined;
    const response = await fetch(
        `https://api.inaturalist.org/v1/places/${placeId}`
    );
    if (!response.ok) {
        throw new Error(`Failed to fetch place with id ${placeId}`);
    }
    const json = await response.json();
    if (json.total_results === 0) return undefined;
    return json.results.at(0) as Place;
}

export const usePlace = (placeId: string | undefined) => {
    return useQuery<Place | undefined, Error>({
        queryKey: ['place', placeId],
        queryFn: () => fetchPlaceById(placeId),
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
};

export default usePlace;
