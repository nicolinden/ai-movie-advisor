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

        Use only the provided movie data. Do not invent awars, actors, directors, reviews, plot details or production facts that are not included below.

        Movie 
        Title: ${movie.title}
        Release date: ${movie.releaseDate}
        Rating: ${movie.rating}
        Runtime: ${movie.runtime}
        Genres: ${movie.genres.join(', ')}
        Overview: ${movie.overview}

        Focus on practical viewing advice:
        - What kind of viewer would enjoy this movie?
        - What kind of viewer might not enjoy it?
        - What is the likely mood or viewing experience?
        - How mentally demanding is it

        Return the analysis using the provided structured output schema.
        `;
}