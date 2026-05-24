import { Component, OnInit, inject, signal } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';
import { MetricsService } from '../../../../core/services/metrics.service';

interface WorkflowRun {
  id: number;
  name: string;
  status: string;
  conclusion: string;
  created_at: string;
  html_url: string;
}

@Component({
  selector: 'app-cicd-widget',
  standalone: true,
  imports: [NgClass, DatePipe],
  template: `
    <div class="card flex flex-col gap-5">
      <div class="flex items-center justify-between">
        <h3 class="text-white font-semibold">CI/CD Pipeline</h3>
        <svg class="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      </div>

      @if (loading()) {
        <div class="space-y-3">
          @for (i of [1,2,3,4,5]; track i) {
            <div class="h-10 bg-surface rounded animate-pulse"></div>
          }
        </div>
      }

      @if (!loading() && runs().length > 0) {
        <div class="space-y-2">
          @for (run of runs(); track run.id) {
            <a [href]="run.html_url" target="_blank"
               class="flex items-center gap-3 p-3 rounded-lg bg-surface hover:bg-surface-border/30 transition-colors group">
              <div [ngClass]="{
                'bg-accent-green': run.conclusion === 'success',
                'bg-red-500':     run.conclusion === 'failure',
                'bg-yellow-500':  run.status === 'in_progress',
                'bg-slate-500':   !run.conclusion && run.status !== 'in_progress'
              }" class="w-2 h-2 rounded-full shrink-0"></div>
              <div class="flex-1 min-w-0">
                <div class="text-slate-300 text-xs font-mono truncate group-hover:text-white transition-colors">
                  {{ run.name }}
                </div>
                <div class="text-slate-600 text-xs">{{ run.created_at | date:'short' }}</div>
              </div>
              <span [ngClass]="{
                'text-accent-green': run.conclusion === 'success',
                'text-red-400':      run.conclusion === 'failure',
                'text-yellow-400':   run.status === 'in_progress'
              }" class="text-xs font-mono shrink-0">
                {{ run.conclusion || run.status }}
              </span>
            </a>
          }
        </div>
      }

      @if (!loading() && runs().length === 0) {
        <div class="text-slate-500 text-sm text-center py-6">
          <p>Configure <code class="text-primary">GITHUB_REPO</code> env var to see pipeline status.</p>
        </div>
      }
    </div>
  `,
})
export class CicdWidgetComponent implements OnInit {
  private readonly metricsService = inject(MetricsService);
  loading = signal(true);
  runs = signal<WorkflowRun[]>([]);

  ngOnInit() {
    this.metricsService.getCICDStatus().subscribe({
      next: data => {
        this.runs.set(data.workflow_runs?.slice(0, 5) ?? []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
