import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  searchMovies(query: string): Observable<MovieSearchResponse> {
    return this.http.get<MovieSearchResponse>(
      `http://localhost:3000/api/movies/search?query=${encodeURIComponent(query)}`
    );
  }
}