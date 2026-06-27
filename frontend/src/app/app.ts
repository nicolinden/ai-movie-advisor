import { Component, inject, signal } from '@angular/core';
import { MovieService } from './services/movie.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
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