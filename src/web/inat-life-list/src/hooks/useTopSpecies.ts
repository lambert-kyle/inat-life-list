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
    lat: number
    lng: number
    radius: number
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

async function fetchTopSpeciesByLatLng(
    lat: number,
    lng: number,
    radius: number,
    limit: number
): Promise<TopSpeciesResult[]> {
    const url = new URL(
        'https://api.inaturalist.org/v1/observations/species_counts'
    )
    url.searchParams.set('lat', lat.toString())
    url.searchParams.set('lng', lng.toString())
    url.searchParams.set('radius', radius.toString()) // in kilometers
    url.searchParams.set('verifiable', 'true')
    url.searchParams.set('spam', 'false')
    url.searchParams.set('locale', 'en')
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

export function useTopSpecies({
    lat,
    lng,
    radius,
    limit,
}: UseTopSpeciesOptions) {
    return useQuery<TopSpeciesResult[], Error>({
        queryKey: ['topSpecies', lat, lng, radius, limit],
        queryFn: () => fetchTopSpeciesByLatLng(lat, lng, radius, limit),
        staleTime: 1000 * 60 * 5,
        retry: 1,
    })
}
