const OUTPUT_LANGUAGE = 'Dutch';

export type MovieAnalysisInput = {
    title: string;
    releaseDate: string;
    rating: number;
    voteCount: number;
    runtime: number | null;
    genres: string[];
    overview: string;
    directors: string[];
    writers: string[];
    topCast: string[];
    keywords: string[];
    certification: string | null;
    originalLanguage: string;
    productionCountries: string[];
};

export function createMovieAnalysisPrompt(
    movie: MovieAnalysisInput,
): string {
    return [
        createRole(),
        createRules(),
        createMovieContext(movie),
        createAnalysisInstructions(),
    ].join('\n\n');
}

function createRole(): string {
    return `
You are an expert movie advisor.

Your goal is to help someone decide whether this movie is worth watching based only on the provided information.
`;
}

function createRules(): string {
    return `
Rules:
- Use only the provided movie data.
- Do not invent facts, awards, reviews, plot details, actors, directors or production information that are not explicitly provided.
- Focus on practical viewing advice instead of retelling the plot.
- Avoid spoilers.
- Write all user-facing output in ${OUTPUT_LANGUAGE}.
`;
}

function createMovieContext(
    movie: MovieAnalysisInput,
): string {
    return `
Movie Context

Title: ${movie.title}
Release date: ${movie.releaseDate}
Rating: ${movie.rating} (${movie.voteCount} votes)
Runtime: ${movie.runtime ?? 'Unknown'} minutes
Certification: ${movie.certification ?? 'Unknown'}

Genres:
${movie.genres.join(', ')}

Original language:
${movie.originalLanguage}

Production countries:
${movie.productionCountries.join(', ')}

Directors:
${movie.directors.join(', ') || 'Unknown'}

Writers:
${movie.writers.join(', ') || 'Unknown'}

Top cast:
${movie.topCast.join(', ') || 'Unknown'}

Keywords:
${movie.keywords.join(', ') || 'None'}

Overview:
${movie.overview}
`;
}

function createAnalysisInstructions(): string {
    return `
Generate the analysis according to these guidelines:

Summary
- Maximum 3 sentences.
- Explain the overall viewing experience.
- Do not repeat the overview.

SuitableFor
- Maximum 5 concise bullet points.
- Describe who is likely to enjoy this movie.

NotSuitableFor
- Maximum 5 concise bullet points.
- Describe who may not enjoy this movie.

Mood
- Describe the overall atmosphere in 1 to 3 words.
- Examples: Epic, Emotional, Dark, Hopeful, Suspenseful.

Complexity
Choose exactly one value.

Low
- Easy to follow.
- Suitable for casual viewing.

Medium
- Requires normal attention.

High
- Requires full attention because of complex storytelling, themes or scientific or philosophical concepts.

Highlights
- Maximum 5 concise bullet points.
- Mention the strongest aspects of the movie.

Caveats
- Maximum 5 concise bullet points.
- Mention things viewers should know before watching.
- Examples: long runtime, slow pacing or emotional themes.

BestMomentToWatch
- One sentence.
- Describe the ideal situation to watch this movie.

WhyWatch
- Maximum 2 sentences.
- Convince the intended audience without spoilers.

Return the analysis using the provided structured output schema.
`;
}