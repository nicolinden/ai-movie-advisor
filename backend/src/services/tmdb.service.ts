import { MovieDetail, MovieSearchResponse } from "../models/movie.model.js";
import { TmdbCreditsResponse, TmdbKeywordsResponse, TmdbMovieDetailResponse, TmdbMovieSearchResponse, TmdbReleaseDatesResponse } from "../models/tmdb.model.js";

const baseUrl = 'https://api.themoviedb.org/3/movie';

function getTmdbToken(): string {
    const token = process.env.TMDB_ACCESS_TOKEN

    if (!token) {
        throw new Error('TMDB_ACCESS_TOKEN is not configured');
    }

    return token;
}

function createTmdbHeaders() {
    return {
        Authorization: `Bearer ${getTmdbToken()}`,
        accept: 'application/json'
    }
}

async function fetchFromTmdb<T>(url: URL): Promise<T> {
    const response = await fetch(url, {
        headers: createTmdbHeaders(),
    });

    if (!response.ok) {
        const errorBody = await response.text();

        console.error('Tmdb request failed', {
            url: url.toString(),
            status: response.status,
            body: errorBody
        });

        throw new Error(`TMDb request failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
}

async function getMovieCredits(movieId: string): Promise<TmdbCreditsResponse> {
    const url = new URL(`${baseUrl}/${movieId}/credits`);
    url.searchParams.set('language', 'en-US');

    return fetchFromTmdb<TmdbCreditsResponse>(url);
}

async function getMovieKeywords(movieId: string): Promise<TmdbKeywordsResponse> {
    const url = new URL(`${baseUrl}/${movieId}/keywords`);

    return fetchFromTmdb<TmdbKeywordsResponse>(url);
}

async function getMovieReleaseDates(movieId: string): Promise<TmdbReleaseDatesResponse> {
    const url = new URL(`${baseUrl}/${movieId}/release_dates`);

    return fetchFromTmdb<TmdbReleaseDatesResponse>(url);
}


export async function searchMovies(query: string): Promise<MovieSearchResponse> {
    const url = new URL('https://api.themoviedb.org/3/search/movie');
    url.searchParams.set('query', query);
    url.searchParams.set('language', 'en-US');
    url.searchParams.set('include_adult', 'false');

    const response = await fetch(url, {
        headers: createTmdbHeaders(),
    });

    if (!response.ok) {
        throw new Error(`TMDb search failed with status ${response.status}`);
    }

    const data = await response.json() as TmdbMovieSearchResponse;

    const movies = data.results.map((movie) => ({
        id: movie.id,
        title: movie.title,
        releaseDate: movie.release_date,
        rating: movie.vote_average,
        posterUrl: movie.poster_path
            ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
            : null,
        overview: movie.overview,
    }));

    return {
        query,
        results: movies,
    };
}

export async function getMovieDetail(movieId: string): Promise<MovieDetail> {
    const url = new URL(`${baseUrl}/${movieId}`);
    url.searchParams.set('language', 'en-US');

    const [movie, credits, keywords, releaseDates] = await Promise.all([
        fetchFromTmdb<TmdbMovieDetailResponse>(url),
        getMovieCredits(movieId),
        getMovieKeywords(movieId),
        getMovieReleaseDates(movieId),
    ]);

    const directors = credits.crew
        .filter((member) => member.job === 'Director')
        .map((member) => member.name);

    const writers = credits.crew
        .filter((member) => ['Writer', 'Screenplay', 'Story'].includes(member.job))
        .map((member) => member.name);

    const topCast = credits.cast
        .sort((a, b) => a.order - b.order)
        .slice(0, 8)
        .map((member) => member.name);

    const certification = releaseDates.results
        .find((country) => country.iso_3166_1 === 'US')?.release_dates
        .map((releaseDate) => releaseDate.certification)
        .find((value) => value.trim().length > 0) ?? null

    return {
        id: movie.id,
        title: movie.title,
        releaseDate: movie.release_date,
        rating: movie.vote_average,
        voteCount: movie.vote_count,
        runtime: movie.runtime,
        genres: movie.genres.map((genre) => genre.name),
        overview: movie.overview,
        posterUrl: movie.poster_path
            ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
            : null,
        backdropUrl: movie.backdrop_path
            ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
            : null,
        directors,
        writers,
        topCast,
        keywords: keywords.keywords.map((keyword) => keyword.name),
        certification,
        originalLanguage: movie.original_language,
        productionCountries: movie.production_countries.map((country) => country.name),
    };
}