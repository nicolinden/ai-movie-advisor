import { MovieDetail } from "../models/movie.model.js";

export type RecommendationCandidate = {
    id: number;
    title: string;
    posterUrl: string | null;
    releaseDate: string;
    rating: number;
    genres: string[];
    overview: string;
}

export function createMovieRecommendationsPrompt(
    sourceMovie: MovieDetail,
    candidates: RecommendationCandidate[],
): string {
    return [
        createRole(),
        createRules(),
        createSourceMovieContext(sourceMovie),
        createCandidateMoviesContext(candidates),
        createRecommendationInstructions(),
    ].join('\n\n');
}

function createRole(): string {
    return `
        You are an expert in recommending movies. 

        Your goal is to give the viewers the best possible recommendations based on a source movie based only on the provided information
    `;
}

function createRules(): string {
    return `
        Rules: 
        - Use only the provided movie data.
        - Do not invent facts, reviews, plot details, actors, directors, or production information.
        - Do not recommend the source movie itself.
        - Do not recommend movies that are not in the candidate list.
    `;
}

function createSourceMovieContext(movie: MovieDetail): string {
    return `
        Source movie: 
        Title: ${movie.title}
        Release date: ${movie.releaseDate} 
        Rating: ${movie.rating} (${movie.voteCount} votes)
        Runtime: ${movie.runtime ?? 'Unknown'} minutes
        Certification: ${movie.certification ?? 'Unknown'}
        Genres: ${movie.genres.join(', ')}
        Directors: ${movie.directors.join(', ') || 'Unknown'}
        Writers: ${movie.writers.join(', ') || 'Unknown'}
        Top cast: ${movie.topCast.join(', ') || 'Unknown'}
        Keywords: ${movie.keywords.join(', ') || 'None'}
        Overview: ${movie.overview}          
    `;
}

function createCandidateMoviesContext(candidates: RecommendationCandidate[]): string {
    const candidateText = candidates
        .map((candidate) => {
            return `
                Candidate ID: ${candidate.id}
                Title: ${candidate.title}
                ReleaseDate: ${candidate.releaseDate || 'Unknown'}
                Rating: ${candidate.rating}
                Genres: ${candidate.genres.join(', ') || 'Unknown'} 
                Overview: ${candidate.overview || 'No overview available'} 
            `;
        }).join('\n---\n');

    return `
        Candidate movies: 
        
        ${candidateText}
    `;
}

function createRecommendationInstructions(): string {
    return `
        Recommendation instructions:

        - Select the 5 best recommendations from the candidate movies.
        - Only recommend movies from the candidate list.
        - Use only candidate IDs that were provided.
        - Do not invent movie IDs, titles, actors, directors, reviews, or facts.
        - Prefer movies that match the source movie in themes, mood, genre, storytelling style, or viewing experience.
        - Avoid recommending a movie only because it shares one actor or one genre. 
        - Give a concise reason for each recommendation.
        - Use matchStrength to indicate how strong the recommendation is. 
        
        Return the recommendations using the provided structured output schema.  
    `;
}