export interface MovieSearchResult {
    id: number;
    title: string;
    releaseDate: string;
    rating: number;
    posterUrl: string | null;
    overview: string;
}

export interface MovieSearchResponse {
    query: string;
    results: MovieSearchResult[];
}