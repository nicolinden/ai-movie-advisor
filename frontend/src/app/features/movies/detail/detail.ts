import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MovieService } from '../../../services/movie.service';
import { MovieDetail } from '../../../models/movie.model';

@Component({
  selector: 'app-detail',
  imports: [RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.scss',
})
export class Detail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly movieService = inject(MovieService);

  protected readonly movie = signal<MovieDetail | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.movieService.getMovieDetail(id).subscribe({
      next: (movie) => {
        this.movie.set(movie);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load movie detail.');
        this.isLoading.set(false);
      },
    })
  }
}