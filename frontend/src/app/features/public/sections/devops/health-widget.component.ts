import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { NgClass, DecimalPipe } from '@angular/common';
import { MetricsService } from '../../../../core/services/metrics.service';
import { ServiceMetrics } from '../../../../core/models';

@Component({
  selector: 'app-health-widget',
  standalone: true,
  imports: [NgClass, DecimalPipe],
  template: `
    <div class="card flex flex-col gap-5">
      <div class="flex items-center justify-between">
        <h3 class="text-white font-semibold">Infrastructure Health</h3>
        <span [ngClass]="status() === 'UP' ? 'bg-accent-green/20 text-accent-green border-accent-green/30'
                                            : 'bg-red-500/20 text-red-400 border-red-500/30'"
              class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border font-mono">
          <span class="w-1.5 h-1.5 rounded-full animate-pulse-slow"
                [ngClass]="status() === 'UP' ? 'bg-accent-green' : 'bg-red-400'"></span>
          {{ status() }}
        </span>
      </div>

      @if (loading()) {
        <div class="space-y-3">
          @for (i of [1,2,3,4]; track i) {
            <div class="h-5 bg-surface rounded animate-pulse"></div>
          }
        </div>
      }

      @if (!loading() && metrics()) {
        <div class="space-y-3 font-mono text-xs">
          <div class="flex justify-between text-slate-400">
            <span>Service</span>
            <span class="text-white">go-metrics</span>
          </div>
          <div class="flex justify-between text-slate-400">
            <span>Uptime</span>
            <span class="text-accent-green">{{ metrics()!.uptime_human }}</span>
          </div>
          <div class="flex justify-between text-slate-400">
            <span>Goroutines</span>
            <span class="text-white">{{ metrics()!.goroutines }}</span>
          </div>
          <div class="flex justify-between text-slate-400">
            <span>Memory (alloc)</span>
            <span class="text-white">{{ metrics()!.memory.alloc_mb | number:'1.1-1' }} MB</span>
          </div>
          <div class="flex justify-between text-slate-400">
            <span>GC runs</span>
            <span class="text-white">{{ metrics()!.memory.gc_runs }}</span>
          </div>
          <div class="flex justify-between text-slate-400">
            <span>Runtime</span>
            <span class="text-accent-blue">{{ metrics()!.go_version }}</span>
          </div>
        </div>
      }

      @if (!loading() && !metrics()) {
        <div class="text-slate-500 text-sm text-center py-4">
          Service waking up (Render free tier)...
          <div class="w-full bg-surface rounded-full h-1 mt-3 overflow-hidden">
            <div class="h-full bg-primary animate-pulse rounded-full w-1/2"></div>
          </div>
        </div>
      }

      <button (click)="refresh()" class="text-primary text-xs font-mono hover:underline text-left mt-auto">
        &#8635; refresh
      </button>
    </div>
  `,
})
export class HealthWidgetComponent implements OnInit, OnDestroy {
  private readonly metricsService = inject(MetricsService);
  loading = signal(true);
  metrics = signal<ServiceMetrics | null>(null);
  status = signal<'UP' | 'DOWN' | 'LOADING'>('LOADING');

  private interval: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.load();
    this.interval = setInterval(() => this.load(), 30_000);
  }

  ngOnDestroy() { if (this.interval) clearInterval(this.interval); }

  refresh() { this.load(); }

  private load() {
    this.metricsService.getMetrics().subscribe({
      next: m => { this.metrics.set(m); this.status.set('UP'); this.loading.set(false); },
      error: () => { this.status.set('DOWN'); this.loading.set(false); },
    });
  }
}
