export interface TaxonData {
    id: number;
    name: string;
    preferred_common_name: string;
    iconic_taxon_id: number;
    iconic_taxon_name: string;
    wikipedia_url?: string;
    default_photo?: {
        square_url: string;
        medium_url: string;
        small_url: string;
        thumb_url: string;
    };
    ancestor_ids?: number[];
}
