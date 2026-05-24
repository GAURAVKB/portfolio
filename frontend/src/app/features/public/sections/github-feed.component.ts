import { Component, OnInit, inject, signal } from '@angular/core';
import { MetricsService } from '../../../core/services/metrics.service';
import { GitHubStats } from '../../../core/models';
import { environment } from '@env/environment';

@Component({
  selector: 'app-github-feed',
  standalone: true,
  template: `
    <section class="py-24 bg-surface">
      <div class="max-w-6xl mx-auto px-6">
        <p class="font-mono text-primary text-sm mb-3">// open source</p>
        <h2 class="section-title">GitHub Activity</h2>

        @if (loading()) {
          <div class="grid md:grid-cols-3 gap-4">
            @for (i of [1,2,3]; track i) {
              <div class="card animate-pulse h-28"></div>
            }
          </div>
        }

        @if (!loading() && stats()) {
          <!-- Profile summary -->
          <div class="flex items-center gap-4 mb-8 p-4 card">
            <img [src]="stats()!.profile.avatar_url" [alt]="stats()!.profile.name"
                 class="w-16 h-16 rounded-full border-2 border-primary/30" />
            <div class="flex-1">
              <h3 class="text-white font-semibold">{{ stats()!.profile.name }}</h3>
              <p class="text-slate-400 text-sm">{{ stats()!.profile.bio }}</p>
            </div>
            <div class="hidden sm:flex gap-6 text-center">
              <div>
                <div class="text-white font-bold font-mono">{{ stats()!.profile.public_repos }}</div>
                <div class="text-slate-500 text-xs">repos</div>
              </div>
              <div>
                <div class="text-white font-bold font-mono">{{ stats()!.profile.followers }}</div>
                <div class="text-slate-500 text-xs">followers</div>
              </div>
            </div>
            <a [href]="stats()!.profile.html_url" target="_blank" class="btn-outline text-sm py-2 px-4 hidden sm:flex">
              GitHub Profile
            </a>
          </div>

          <!-- Top repos -->
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (repo of stats()!.top_repos; track repo.name) {
              <a [href]="repo.html_url" target="_blank" class="card group hover:border-primary/40 cursor-pointer block">
                <h4 class="text-white font-medium group-hover:text-primary transition-colors mb-2">{{ repo.name }}</h4>
                <p class="text-slate-400 text-xs line-clamp-2 mb-4">{{ repo.description || 'No description' }}</p>
                <div class="flex items-center gap-4 text-xs text-slate-500 font-mono">
                  @if (repo.language) {
                    <span class="flex items-center gap-1">
                      <span class="w-2 h-2 rounded-full bg-accent-blue"></span>
                      {{ repo.language }}
                    </span>
                  }
                  <span>★ {{ repo.stargazers_count }}</span>
                  <span>⑂ {{ repo.forks_count }}</span>
                </div>
              </a>
            }
          </div>
        }

        @if (!loading() && !stats()) {
          <div class="text-center py-12 text-slate-500">
            <p>Could not load GitHub data. <a [href]="'https://github.com/' + username" target="_blank" class="text-primary hover:underline">View profile directly</a>.</p>
          </div>
        }
      </div>
    </section>
  `,
})
export class GithubFeedComponent implements OnInit {
  private readonly metricsService = inject(MetricsService);
  loading = signal(true);
  stats = signal<GitHubStats | null>(null);
  readonly username = environment.githubUsername;

  ngOnInit() {
    this.metricsService.getGitHubStats().subscribe({
      next: s => { this.stats.set(s); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
