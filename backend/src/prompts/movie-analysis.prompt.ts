type MovieAnalysisInput = {
    title: string;
    releaseDate: string;
    rating: number;
    runtime: number | null;
    genres: string[];
    overview: string;
};

export function createMovieAnalysisPrompt(movie: MovieAnalysisInput): string {
    return `
        You are an expert movie advisor. 
        Analyze this movie for someone deciding wheter to watch it.

        Movie 

        Title: ${movie.title}
        Release date: ${movie.releaseDate}
        Rating: ${movie.rating}
        Runtime: ${movie.runtime}
        Genres: ${movie.genres.join(', ')}
        Overview: ${movie.overview}

        Return ONLY valid JSON.

        The JSON MUST exactly match this structure:

        {
            "summary": "string",
            "suitableFor": ["string"],
            "notSuitableFor": ["string"],
            "mood": "string",
            "complexity": "Low | Medium | High",
            "whyWatch": "string"
        }

        Rules:
        - Do not return markdown.
        - Do not wrap the JSON in code fences.
        - Do not add additional fields.
        - Do not omit fields.
        - Do not invent facts that are not supported by the provided movie data.
    `;
}