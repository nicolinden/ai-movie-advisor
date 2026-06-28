import { MovieDetail, MovieSearchResponse } from "../models/movie.model.js";
import { TmdbMovieDetailResponse, TmdbMovieSearchResponse } from "../models/tmdb.model.js";

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
    const url = new URL(`https://api.themoviedb.org/3/movie/${movieId}`);
    url.searchParams.set('language', 'en-US');

    const response = await fetch(url, {
        headers: createTmdbHeaders(),
    });

    if (!response.ok) {
        const errorBody = await response.text();

        console.error('TMDb movie detail request failed', {
            movieId,
            status: response.status,
            body: errorBody
        });

        throw new Error(`TMDb movie detail failed with status ${response.status}`);
    }

    const movie = await response.json() as TmdbMovieDetailResponse;

    return {
        id: movie.id,
        title: movie.title,
        releaseDate: movie.release_date,
        rating: movie.vote_average,
        posterUrl: movie.poster_path
            ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
            : null,
        backdropUrl: movie.backdrop_path
            ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
            : null,
        overview: movie.overview,
        runtime: movie.runtime ?? null,
        genres: movie.genres?.map((genre) => genre.name) ?? [],
    };
}