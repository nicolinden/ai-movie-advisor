import { Component, input } from '@angular/core';
import { MovieDetail } from '../../../../models/movie.model';

@Component({
  selector: 'app-movie-hero',
  imports: [],
  templateUrl: './movie-hero.html',
  styleUrl: './movie-hero.scss',
})
export class MovieHero {
  readonly movie = input.required<MovieDetail>();
}
