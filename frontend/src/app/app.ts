import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly http = inject(HttpClient);
  protected readonly title = signal('ai-movie-advisor-frontend');
  protected readonly backendStatus = signal<string>('Not checked yet');

  protected checkBackend(): void {
    this.http
      .get<{ status: string, service: string }>('http://localhost:3000/api/health')
      .subscribe({
        next: (response) => {
          this.backendStatus.set(`${response.status} - ${response.service}`);
        },
        error: () => {
          this.backendStatus.set('Backend not reachable');
        },
      });
  }
}