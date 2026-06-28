export interface TmdbMovieSearchResponse {
    results: TmdbMovieSearchResult[];
}

export interface TmdbMovieSearchResult {
    id: number;
    title: string;
    release_date: string;
    vote_average: number;
    poster_path: string | null;
    overview: string;
}

export interface TmdbMovieDetailResponse {
    id: number;
    title: string;
    release_date: string;
    vote_average: number;
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string;
    runtime: number | null;
    genres: TmdbGenre[];
}

export interface TmdbGenre {
    id: number;
    name: string;
}