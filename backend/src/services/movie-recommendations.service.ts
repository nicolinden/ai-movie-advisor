import { createMovieRecommendationsPrompt } from "../prompts/movie-recommendations.prompt.js";
import { movieRecommendationsSchema } from "../schemas/movie-recommendations.schema.js";
import { executeJsonPrompt } from "./openai.service.js";
import { getMovieDetail, getRecommendationsCandidate } from "./tmdb.service.js";
import { MovieRecommendationResponse } from "../models/movie-recommendation.model.js";


export async function recommendMovies(movieId: string): Promise<MovieRecommendationResponse> {
    const sourceMovie = await getMovieDetail(movieId);
    const candidates = await getRecommendationsCandidate(movieId);
    const prompt = createMovieRecommendationsPrompt(sourceMovie, candidates);

    const aiRecommendations = await executeJsonPrompt<MovieRecommendationResponse>(
        prompt,
        movieRecommendationsSchema,
        'movie_recommendation'
    );

    return {
        recommendations: aiRecommendations.recommendations
            .map((recommendation) => {
                const candidate = candidates.find((candidate) => candidate.id === recommendation.id);
                if (!candidate) {
                    throw new Error(`Recommendation candidate ${recommendation.id} not found.`);
                }

                return {
                    id: candidate.id,
                    title: candidate.title,
                    releaseDate: candidate.releaseDate,
                    rating: candidate.rating,
                    posterUrl: candidate.posterUrl,
                    reason: recommendation.reason,
                    matchStrength: recommendation.matchStrength
                }
            })
    }
}