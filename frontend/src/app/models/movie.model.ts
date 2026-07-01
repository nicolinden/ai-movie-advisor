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
    posterUrl: string | null;
    backdropUrl: string | null;
    overview: string;
    runtime: number | null;
    genres: string[];
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

export interface MovieRecommendation {
    id: number;
    title: string;
    posterUrl: string | null;
    releaseDate: string;
    rating: number;
    reason: string;
    matchStrength: 'Low' | 'Medium' | 'High';
}

export interface MovieRecommendationResponse {
    recommendations: MovieRecommendation[];
}