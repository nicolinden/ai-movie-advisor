export interface MovieSearchResult {
    id: number;
    title: string;
    releaseDate: string;
    rating: number;
    posterUrl: string | null;
    overview: string;
}

export interface MovieSearchResponse {
    query: string;
    results: MovieSearchResult[];
}

export interface MovieDetail {
    id: number;
    title: string;
    releaseDate: string;
    rating: number;
    voteCount: number;
    runtime: number | null;
    genres: string[];
    overview: string;

    posterUrl: string | null;
    backdropUrl: string | null;

    directors: string[];
    writers: string[];
    topCast: string[];
    keywords: string[];
    certification: string | null;

    originalLanguage: string;
    productionCountries: string[];
}

export interface MovieAnalysis {
    summary: string;
    suitableFor: string[];
    notSuitableFor: string[];
    mood: string;
    complexity: 'Low' | 'Medium' | 'High';
    highlights: string[];
    caveats: string[];
    bestMomentToWatch: string;
    whyWatch: string;
}