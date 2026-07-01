import { Component, input } from '@angular/core';
import { MovieRecommendation } from '../../../../models/movie.model';
import { DecimalPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movie-recommendations',
  imports: [DecimalPipe, NgClass, RouterLink],
  templateUrl: './movie-recommendations.html',
  styleUrl: './movie-recommendations.scss',
})
export class MovieRecommendations {
  readonly recommendations = input.required<MovieRecommendation[]>();

  protected readonly matchStrengthStyles = {
    High: "border-green-900/60 bg-green-950/50 text-green-300",
    Medium: "border-yellow-900/60 bg-yellow-950/50 text-yellow-300",
    Low: "border-red-900/60 bg-red-950/50 text-red-300",
  } as const;
}