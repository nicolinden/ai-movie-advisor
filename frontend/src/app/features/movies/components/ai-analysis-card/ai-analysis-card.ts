import { Component, input } from '@angular/core';
import { MovieAnalysis } from '../../../../models/movie.model';

@Component({
  selector: 'app-ai-analysis-card',
  imports: [],
  templateUrl: './ai-analysis-card.html',
  styleUrl: './ai-analysis-card.scss',
})
export class AiAnalysisCard {
  readonly analysis = input.required<MovieAnalysis>();
}
