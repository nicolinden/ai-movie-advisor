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
    vote_count: number;
    runtime: number | null;
    genres: TmdbGenre[];
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    original_language: string;
    production_countries: TmdbProductionCountry[];
}

export interface TmdbProductionCountry {
    iso_3166_1: string;
    name: string;
}

export interface TmdbCreditsResponse {
    cast: TmdbCastMember[];
    crew: TmdbCrewMember[];
}

export interface TmdbCastMember {
    name: string;
    order: number;
}

export interface TmdbCrewMember {
    name: string;
    job: string;
}

export interface TmdbKeywordsResponse {
    keywords: TmdbKeyword[];
}

export interface TmdbKeyword {
    id: number;
    name: string;
}

export interface TmdbReleaseDatesResponse {
    results: TmdbReleaseCountry[];
}

export interface TmdbReleaseCountry {
    iso_3166_1: string;
    release_dates: TmdbReleaseDate[];
}

export interface TmdbReleaseDate {
    certification: string;
}

export interface TmdbGenre {
    id: number;
    name: string;
}

export interface TmdSimilarMoviesResponse {
    results: TmdbSimilarMovie[];
}

export interface TmdbSimilarMovie {
    id: number;
    adult: boolean;
    genre_ids: number[];
    title: string;
    vote_average: number;
    vote_count: number;
    overview: string;
    poster_path: string | null;
    release_date: string;
}

export interface TmdbGenresResponse {
    genres: TmdbGenre[];
}