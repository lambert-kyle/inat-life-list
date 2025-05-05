import { useQuery } from '@tanstack/react-query'

interface TopSpeciesResult {
    id: number
    name: string
    preferred_common_name: string
    iconic_taxon_name: string
    observations_count: number
    wikipedia_url?: string
    default_photo?: {
        square_url: string
        medium_url: string
        small_url: string
        thumb_url: string
    }
}

interface UseTopSpeciesOptions {
    placeId: number
    limit: number
}

interface SpeciesCountResult {
    count: number
    taxon: {
        id: number
        name: string
        preferred_common_name: string
        iconic_taxon_name: string
        wikipedia_url?: string
        default_photo?: {
            square_url: string
            medium_url: string
            small_url: string
            thumb_url: string
        }
    }
}

async function fetchTopSpecies(
    placeId: number,
    limit: number
): Promise<TopSpeciesResult[]> {
    const url = new URL(
        'https://api.inaturalist.org/v1/observations/species_counts'
    )
    url.searchParams.set('place_id', placeId.toString())
    url.searchParams.set('verifiable', 'true')
    url.searchParams.set('spam', 'false')
    url.searchParams.set('locale', 'en')
    // Not sure what preferred_place_id is for, maybe also pass placeid here?
    // url.searchParams.set('preferred_place_id', ?)
    url.searchParams.set('per_page', limit.toString())
    url.searchParams.set('order_by', 'observation_count')

    const res = await fetch(url.toString())
    if (!res.ok) {
        throw new Error('Failed to fetch top species')
    }

    const json = await res.json()
    return json.results.map((r: SpeciesCountResult) => ({
        id: r.taxon.id,
        name: r.taxon.name,
        preferred_common_name: r.taxon.preferred_common_name,
        iconic_taxon_name: r.taxon.iconic_taxon_name,
        observations_count: r.count,
        wikipedia_url: r.taxon.wikipedia_url,
        default_photo: r.taxon.default_photo,
    }))
}

export function useTopSpecies({ placeId, limit }: UseTopSpeciesOptions) {
    return useQuery<TopSpeciesResult[], Error>({
        queryKey: ['topSpecies', placeId, limit],
        queryFn: () => fetchTopSpecies(placeId, limit),
        staleTime: 1000 * 60 * 5, // cache for 5 minutes
        retry: 1, // retry once on failure
    })
}
