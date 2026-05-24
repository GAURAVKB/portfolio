import { Component, OnInit, inject, signal } from '@angular/core';
import { ProjectsService } from '../../../core/services/projects.service';
import { Project } from '../../../core/models';

@Component({
  selector: 'app-projects',
  standalone: true,
  template: `
    <section id="projects" class="py-24 bg-surface-card/30">
      <div class="max-w-6xl mx-auto px-6">
        <p class="font-mono text-primary text-sm mb-3">// featured work</p>
        <h2 class="section-title">Projects</h2>
        <p class="section-subtitle">A selection of systems I've designed and shipped.</p>

        @if (loading()) {
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (i of [1,2,3]; track i) {
              <div class="card animate-pulse h-64"></div>
            }
          </div>
        }

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (project of projects(); track project.id) {
            <div class="card flex flex-col gap-4 group">
              @if (project.imageUrl) {
                <img [src]="project.imageUrl" [alt]="project.title"
                     class="w-full h-40 object-cover rounded-lg opacity-80 group-hover:opacity-100 transition-opacity" />
              } @else {
                <div class="w-full h-40 bg-surface rounded-lg flex items-center justify-center">
                  <svg class="w-12 h-12 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                  </svg>
                </div>
              }

              <div class="flex-1">
                <div class="flex items-start justify-between gap-2 mb-2">
                  <h3 class="text-white font-semibold text-lg leading-tight">{{ project.title }}</h3>
                  @if (project.featured) {
                    <span class="badge shrink-0">Featured</span>
                  }
                </div>
                <p class="text-slate-400 text-sm leading-relaxed line-clamp-3">{{ project.description }}</p>
              </div>

              @if (project.techStack) {
                <div class="flex flex-wrap gap-2">
                  @for (tech of project.techStack.split(',').slice(0, 4); track tech) {
                    <span class="badge text-xs">{{ tech.trim() }}</span>
                  }
                </div>
              }

              <div class="flex gap-3 pt-2 border-t border-surface-border">
                @if (project.githubUrl) {
                  <a [href]="project.githubUrl" target="_blank"
                     class="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    Code
                  </a>
                }
                @if (project.demoUrl) {
                  <a [href]="project.demoUrl" target="_blank"
                     class="text-slate-400 hover:text-primary transition-colors text-sm flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                    Live Demo
                  </a>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class ProjectsComponent implements OnInit {
  private readonly projectsService = inject(ProjectsService);
  loading = signal(true);
  projects = signal<Project[]>([]);

  ngOnInit() {
    this.projectsService.getAll().subscribe({
      next: p => { this.projects.set(p); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
