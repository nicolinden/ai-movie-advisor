import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../../services/movie.service';
import { MovieSearchResponse, SearchResult } from '../../../models/movie.model';
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
  protected readonly movies = signal<SearchResult[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly currentPage = signal(0);
  protected readonly totalPages = signal(0);
  protected readonly totalResults = signal(0);
  protected readonly hasPreviousPage = computed(() => this.currentPage() > 1);
  protected readonly hasNextPage = computed(() => this.currentPage() < this.totalPages());
  protected readonly hasSearched = computed(() => this.currentPage() > 0);

  private readonly lastQuery = signal('');

  protected searchMovies(): void {
    const query = this.searchQuery().trim();

    if (!query) {
      this.errorMessage.set('Enter a movie title first');
      return;
    }

    this.lastQuery.set(query);
    this.loadSearchPage(query, 1);
  }

  protected loadPreviousPage(): void {
    if (this.isLoading() || !this.hasPreviousPage()) {
      return;
    }

    this.loadSearchPage(this.lastQuery(), this.currentPage() - 1);
  }

  protected loadNextPage(): void {
    if (this.isLoading() || !this.hasNextPage()) {
      return;
    }

    this.loadSearchPage(this.lastQuery(), this.currentPage() + 1);
  }

  private loadSearchPage(query: string, page: number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.movieService.searchMovies(query, page)
      .subscribe({
        next: (response) => {
          this.applySearchResponse(response);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Could not search movies.');
          this.isLoading.set(false);
        }
      });
  }

  private applySearchResponse(response: MovieSearchResponse): void {
    this.currentPage.set(response.page);
    this.totalPages.set(response.totalPages);
    this.totalResults.set(response.totalResults);
    this.movies.set(response.results);
  }
}
