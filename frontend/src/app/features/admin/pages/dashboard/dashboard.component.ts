import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProjectsService } from '../../../../core/services/projects.service';
import { SkillsService } from '../../../../core/services/skills.service';
import { BlogService } from '../../../../core/services/blog.service';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div>
      <h1 class="text-2xl font-bold text-white mb-8">Dashboard</h1>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        @for (stat of stats(); track stat.label) {
          <div class="card flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              {{ stat.icon }}
            </div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">{{ stat.value }}</div>
              <div class="text-slate-500 text-sm">{{ stat.label }}</div>
            </div>
          </div>
        }
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="card">
          <h2 class="text-white font-semibold mb-4">Quick Actions</h2>
          <div class="space-y-3">
            @for (action of quickActions; track action.label) {
              <a [routerLink]="action.path"
                 class="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-surface-border/30 transition-colors group">
                <span class="text-slate-300 group-hover:text-white text-sm transition-colors">{{ action.label }}</span>
                <svg class="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </a>
            }
          </div>
        </div>

        <div class="card">
          <h2 class="text-white font-semibold mb-4">API Status</h2>
          @if (apiStatus()) {
            <div class="flex items-center gap-2 text-accent-green">
              <span class="w-2 h-2 rounded-full bg-accent-green animate-pulse-slow"></span>
              <span class="font-mono text-sm">Spring Boot API — UP</span>
            </div>
          } @else {
            <div class="flex items-center gap-2 text-red-400">
              <span class="w-2 h-2 rounded-full bg-red-400"></span>
              <span class="font-mono text-sm">API — checking...</span>
            </div>
          }
          <p class="text-slate-500 text-xs mt-4">
            Last checked: {{ lastChecked() }}
          </p>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent extends ApiService implements OnInit {
  stats = signal<{ icon: string; value: number; label: string }[]>([]);
  apiStatus = signal(false);
  lastChecked = signal('—');

  readonly quickActions = [
    { path: '/admin/projects',     label: 'Manage Projects' },
    { path: '/admin/skills',       label: 'Manage Skills' },
    { path: '/admin/blog',         label: 'Write a Blog Post' },
    { path: '/admin/testimonials', label: 'Manage Testimonials' },
    { path: '/admin/contacts',     label: 'View Messages' },
  ];

  private readonly projectsService = inject(ProjectsService);
  private readonly skillsService   = inject(SkillsService);
  private readonly blogService     = inject(BlogService);

  ngOnInit() {
    forkJoin({
      projects: this.projectsService.getAll(),
      skills:   this.skillsService.getAll(),
      blog:     this.blogService.getAll(),
      contacts: this.http.get<any>(this.url('/contact/unread-count')),
    }).subscribe({
      next: data => {
        this.stats.set([
          { icon: '⬡', value: data.projects.length,           label: 'Projects' },
          { icon: '◈', value: data.skills.length,             label: 'Skills' },
          { icon: '✦', value: data.blog.totalElements,         label: 'Blog Posts' },
          { icon: '✉', value: data.contacts.count,            label: 'Unread Messages' },
        ]);
      },
    });

    this.http.get(this.url('/health')).subscribe({
      next: () => { this.apiStatus.set(true); this.lastChecked.set(new Date().toLocaleTimeString()); },
      error: () => { this.apiStatus.set(false); this.lastChecked.set(new Date().toLocaleTimeString()); },
    });
  }
}
