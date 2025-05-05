import { useQuery } from '@tanstack/react-query';

interface ObservedTaxon {
    taxon: {
        id: number;
    };
}

const fetchUserObservations = async (
    userId: number | undefined
): Promise<Set<number>> => {
    const perPage = 200; // max supported by iNat
    let page = 1;
    const seenTaxa = new Set<number>();

    if (userId == undefined) return seenTaxa;

    while (true) {
        const url = `https://api.inaturalist.org/v1/observations?user_id=${userId}&per_page=${perPage}&page=${page}&order_by=observed_on&order=desc`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch user observations');
        }

        const json = await response.json();
        const results: ObservedTaxon[] = json.results;

        for (const obs of results) {
            if (obs.taxon?.id) {
                seenTaxa.add(obs.taxon.id);
            }
        }

        if (results.length < perPage) break; // last page
        page += 1;
    }

    return seenTaxa;
};

export const useUserObservations = (userId: number | undefined) => {
    return useQuery({
        queryKey: ['userObservations', userId],
        queryFn: () => {
            if (userId == undefined) throw new Error('User ID is required');
            return fetchUserObservations(userId);
        },
        enabled: userId != null,
        staleTime: 1000 * 60 * 5, // 5 min
    });
};
