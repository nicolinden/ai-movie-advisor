import { MovieAnalysis } from "../models/movie.model.js";
import { createMovieAnalysisPrompt } from "../prompts/movie-analysis.prompt.js";
import { movieAnalysisSchema } from "../schemas/movie-analysis.schema.js";
import { executeJsonPrompt } from "./openai.service.js";
import { getMovieDetail } from "./tmdb.service.js";

export async function analyzeMovie(
    movieId: string,
): Promise<MovieAnalysis> {
    const movieDetail = await getMovieDetail(movieId);
    const prompt = createMovieAnalysisPrompt(movieDetail);

    return executeJsonPrompt<MovieAnalysis>(
        prompt,
        movieAnalysisSchema,
        'movie_analysis',
    )
}