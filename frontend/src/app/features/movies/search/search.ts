import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../../services/movie.service';
import { MovieSearchResult } from '../../../models/movie.model';
import { MovieCard } from '../components/movie-card/movie-card';

@Component({
  selector: 'app-search',
  imports: [RouterLink, MovieCard],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  private readonly movieService = inject(MovieService);

  protected readonly searchQuery = signal('');
  protected readonly movies = signal<MovieSearchResult[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected searchMovies(): void {
    const query = this.searchQuery().trim();

    if (!query) {
      this.errorMessage.set('Enter a movie title first');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.movieService.searchMovies(query)
      .subscribe({
        next: (response) => {
          this.movies.set(response.results);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Could not search movies.');
          this.isLoading.set(false);
        }
      });
  }
}
