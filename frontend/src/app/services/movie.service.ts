import { HttpClient } from '@angular/common/http';
import { inject, Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieSearchResponse, MovieDetail, MovieAnalysis } from '../models/movie.model';

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

  getMovieDetail(id: number): Observable<MovieDetail> {
    return this.http.get<MovieDetail>(
      `${this.apiBaseUrl}/movies/${id}`
    );
  }

  analyzeMovie(id: number): Observable<MovieAnalysis> {
    return this.http.post<MovieAnalysis>(
      `${this.apiBaseUrl}/movies/${id}/analyze`,
      {}
    );
  }
}