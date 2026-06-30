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