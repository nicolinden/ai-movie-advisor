import { HttpClient } from '@angular/common/http';
import { inject, Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';

export interface MovieSearchResult {
  id: number;
  title: string;
  releaseDate: string;
  rating: number;
  posterUrl: string | null;
  overview: string;
}

interface MovieSearchResponse {
  query: string;
  results: MovieSearchResult[];
}

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly http = inject(HttpClient);

  private readonly apiBaseUrl = isDevMode()
    ? 'http://localhost:3000/api'
    : '/api';

  searchMovies(query: string): Observable<MovieSearchResponse> {
    return this.http.get<MovieSearchResponse>(
      `${this.apiBaseUrl}/movies/search?query=${encodeURIComponent(query)}`
    );
  }
}