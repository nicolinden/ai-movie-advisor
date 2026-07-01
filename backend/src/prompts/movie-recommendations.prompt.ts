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
        You are a professional film critic and movie recommendation expert. 

        Your task is not to find movies with the same genre.
        Your task is to recommend movies that someone who genuinely loved the source movie is most likely to enjoy. 
    `;
}

function createRules(): string {
    return `
        Rules: 
        - Use only the provided movie data.
        - Do not invent facts, reviews, plot details, actors, directors, or production information.
        - Do not recommend the source movie itself.
        - Do not recommend movies that are not in the candidate list.
        - Do not recommend a movie only because it shares one genre or one actor with the source movie. 
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

        Evaluate each candidate against the source movie using these criteria: 
        - Core themes
        - Emotional impact
        - Narrative style 
        - Pacing
        - Tone and atmosphere
        - Target audience
        - Genre fit 
        - Overall viewing experience 
        - Rating and vote reliability

        Prioritize movies that match the source movie's deeper viewing experience, not just surface-level genre similarity. 

        When choosing between similar candidates: 
        - Prefer stronger thematic and emotional matches.
        - Prefer higher-rated movies with meaningful vote counts. 
        - Avoid weak, obscure, or poorly rated candidates unless they are clearly the best thematic fit. 

        Select the 5 recommendations from the candidate movies.

        For each recommendation: 
        - Give a concise reason that explains the actual match. 
        - Mention the shared viewing experience, theme, tone, or storytelling connection. 
        - Do not write generic reasons such as "same genre" or "similar sci-fi elements".
        - Use matchStrength to indicate how strong the recommendation is: 
            - High: strong in theme, tone, and viewing experience. 
            - Medium: good match, but only on some dimensions. 
            - Low: acceptable but weaker match. 

        Return the recommendations using the provided structured output schema.
    `;
}