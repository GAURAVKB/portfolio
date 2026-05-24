import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectsService } from '../../../../core/services/projects.service';
import { Project } from '../../../../core/models';

@Component({
  selector: 'app-projects-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-white">Projects</h1>
      <button (click)="openForm()" class="btn-primary text-sm py-2 px-4">+ Add Project</button>
    </div>

    <!-- Form modal -->
    @if (showForm()) {
      <div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div class="bg-surface-card border border-surface-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
          <h2 class="text-white font-semibold text-lg mb-6">{{ editing() ? 'Edit' : 'New' }} Project</h2>
          <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="label">Title *</label>
                <input formControlName="title" class="input text-sm" />
              </div>
              <div>
                <label class="label">Image URL</label>
                <input formControlName="imageUrl" class="input text-sm" placeholder="https://..." />
              </div>
            </div>
            <div>
              <label class="label">Description</label>
              <textarea formControlName="description" rows="3" class="input text-sm resize-none"></textarea>
            </div>
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="label">GitHub URL</label>
                <input formControlName="githubUrl" class="input text-sm" />
              </div>
              <div>
                <label class="label">Demo URL</label>
                <input formControlName="demoUrl" class="input text-sm" />
              </div>
            </div>
            <div>
              <label class="label">Tech Stack (comma-separated)</label>
              <input formControlName="techStack" class="input text-sm" placeholder="Java, Spring Boot, Angular" />
            </div>
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="label">Sort Order</label>
                <input formControlName="sortOrder" type="number" class="input text-sm" />
              </div>
              <div class="flex items-center gap-3 pt-6">
                <input type="checkbox" formControlName="featured" class="accent-primary w-4 h-4" id="featured"/>
                <label for="featured" class="text-slate-300 text-sm cursor-pointer">Featured project</label>
              </div>
            </div>
            <div class="flex gap-3 pt-4 border-t border-surface-border">
              <button type="submit" class="btn-primary text-sm" [disabled]="saving()">
                {{ saving() ? 'Saving...' : 'Save Project' }}
              </button>
              <button type="button" (click)="closeForm()" class="btn-outline text-sm">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- List -->
    @if (loading()) {
      <div class="space-y-3">
        @for (i of [1,2,3]; track i) { <div class="card animate-pulse h-20"></div> }
      </div>
    }

    <div class="space-y-3">
      @for (project of projects(); track project.id) {
        <div class="card flex items-center gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h3 class="text-white font-medium truncate">{{ project.title }}</h3>
              @if (project.featured) { <span class="badge text-xs">Featured</span> }
            </div>
            <p class="text-slate-500 text-xs mt-1 truncate">{{ project.techStack }}</p>
          </div>
          <div class="flex gap-2 shrink-0">
            <button (click)="openForm(project)" class="text-slate-400 hover:text-primary transition-colors p-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
            <button (click)="delete(project.id)" class="text-slate-400 hover:text-red-400 transition-colors p-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      }
      @if (!loading() && projects().length === 0) {
        <div class="text-center py-16 text-slate-500">No projects yet. Add your first one!</div>
      }
    </div>
  `,
})
export class ProjectsAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly projectsService = inject(ProjectsService);

  loading = signal(true);
  saving = signal(false);
  showForm = signal(false);
  editing = signal<Project | null>(null);
  projects = signal<Project[]>([]);

  form = this.fb.group({
    title:       ['', Validators.required],
    description: [''],
    techStack:   [''],
    githubUrl:   [''],
    demoUrl:     [''],
    imageUrl:    [''],
    featured:    [false],
    sortOrder:   [0],
  });

  ngOnInit() { this.load(); }

  load() {
    this.projectsService.getAll().subscribe({
      next: p => { this.projects.set(p); this.loading.set(false); },
    });
  }

  openForm(project?: Project) {
    this.editing.set(project ?? null);
    this.form.reset(project ?? { title: '', description: '', techStack: '', githubUrl: '', demoUrl: '', imageUrl: '', featured: false, sortOrder: 0 });
    this.showForm.set(true);
  }

  closeForm() { this.showForm.set(false); this.editing.set(null); }

  save() {
    if (this.form.invalid) return;
    this.saving.set(true);
    const data = this.form.value as any;
    const op = this.editing()
      ? this.projectsService.update(this.editing()!.id, data)
      : this.projectsService.create(data);
    op.subscribe({
      next: () => { this.saving.set(false); this.closeForm(); this.load(); },
      error: () => this.saving.set(false),
    });
  }

  delete(id: number) {
    if (!confirm('Delete this project?')) return;
    this.projectsService.delete(id).subscribe(() => this.load());
  }
}
