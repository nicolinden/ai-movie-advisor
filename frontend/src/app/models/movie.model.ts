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

export interface MovieDetail {
    id: number;
    title: string;
    releaseDate: string;
    rating: number;
    posterUrl: string | null;
    backdropUrl: string | null;
    overview: string;
    runtime: number | null;
    genres: string[];
}