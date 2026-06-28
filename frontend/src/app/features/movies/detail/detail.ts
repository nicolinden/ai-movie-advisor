import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MovieService } from '../../../services/movie.service';
import { MovieAnalysis, MovieDetail } from '../../../models/movie.model';
import { AiAnalysisCard } from '../components/ai-analysis-card/ai-analysis-card';
import { MovieHero } from '../components/movie-hero/movie-hero';

@Component({
  selector: 'app-detail',
  imports: [RouterLink, AiAnalysisCard, MovieHero],
  templateUrl: './detail.html',
  styleUrl: './detail.scss',
})
export class Detail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly movieService = inject(MovieService);

  protected readonly movie = signal<MovieDetail | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly analysis = signal<MovieAnalysis | null>(null);
  protected readonly isAnalyzing = signal(false);
  protected readonly analysisError = signal<string | null>(null);

  protected analyzeMovie(): void {
    const movie = this.movie();

    if (!movie) {
      return;
    }

    this.isAnalyzing.set(true);
    this.analysisError.set(null);

    this.movieService.analyzeMovie(movie.id).subscribe({
      next: (analysis) => {
        this.analysis.set(analysis);
        this.isAnalyzing.set(false);
      },
      error: () => {
        this.analysisError.set('Could not analyze this movie.');
        this.isAnalyzing.set(false);
      }
    })
  }

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