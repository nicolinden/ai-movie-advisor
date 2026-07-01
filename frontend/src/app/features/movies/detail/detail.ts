import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MovieService } from '../../../services/movie.service';
import { MovieAnalysis, MovieDetail, MovieRecommendation } from '../../../models/movie.model';
import { AiAnalysisCard } from '../components/ai-analysis-card/ai-analysis-card';
import { MovieHero } from '../components/movie-hero/movie-hero';
import { MovieRecommendations } from '../components/movie-recommendations/movie-recommendations';

@Component({
  selector: 'app-detail',
  imports: [RouterLink, AiAnalysisCard, MovieHero, MovieRecommendations],
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

  protected readonly recommendations = signal<MovieRecommendation[] | null>(null);
  protected readonly isLoadingRecommendations = signal(false);
  protected readonly recommendationsError = signal<string | null>(null);


  protected generateAiAdvice(): void {
    this.analyzeMovie();
    this.getRecommendations();
  }

  private analyzeMovie(): void {
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

  private getRecommendations(): void {
    const movie = this.movie();

    if (!movie) return;

    this.isLoadingRecommendations.set(true);
    this.recommendationsError.set(null);

    this.movieService.getRecommendations(movie.id).subscribe({
      next: (results) => {
        this.recommendations.set(results.recommendations);
        this.isLoadingRecommendations.set(false);
      },
      error: () => {
        this.recommendationsError.set('Could not load movie recommendations');
        this.isLoadingRecommendations.set(false);
      }
    });
  }

  private resetMovieState() {
    this.movie.set(null);
    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.analysis.set(null);
    this.analysisError.set(null);
    this.isAnalyzing.set(false);

    this.recommendations.set(null);
    this.recommendationsError.set(null);
    this.isLoadingRecommendations.set(false);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));

      this.resetMovieState();
      window.scrollTo({ top: 0, behavior: 'smooth' });

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
    });
  }
}