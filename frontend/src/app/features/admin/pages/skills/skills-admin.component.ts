import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SkillsService } from '../../../../core/services/skills.service';
import { Skill } from '../../../../core/models';

@Component({
  selector: 'app-skills-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-white">Skills</h1>
      <button (click)="openForm()" class="btn-primary text-sm py-2 px-4">+ Add Skill</button>
    </div>

    @if (showForm()) {
      <div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div class="bg-surface-card border border-surface-border rounded-xl w-full max-w-md p-6">
          <h2 class="text-white font-semibold text-lg mb-6">{{ editing() ? 'Edit' : 'New' }} Skill</h2>
          <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
            <div>
              <label class="label">Skill Name *</label>
              <input formControlName="name" class="input text-sm" placeholder="Java" />
            </div>
            <div>
              <label class="label">Category</label>
              <input formControlName="category" class="input text-sm" placeholder="Backend, Frontend, DevOps..." />
            </div>
            <div>
              <label class="label">Proficiency ({{ form.get('proficiency')?.value }}%)</label>
              <input formControlName="proficiency" type="range" min="0" max="100" class="w-full accent-primary" />
            </div>
            <div>
              <label class="label">Sort Order</label>
              <input formControlName="sortOrder" type="number" class="input text-sm" />
            </div>
            <div class="flex gap-3 pt-4 border-t border-surface-border">
              <button type="submit" class="btn-primary text-sm" [disabled]="saving()">
                {{ saving() ? 'Saving...' : 'Save' }}
              </button>
              <button type="button" (click)="closeForm()" class="btn-outline text-sm">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    }

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      @for (skill of skills(); track skill.id) {
        <div class="card">
          <div class="flex justify-between items-start mb-3">
            <div>
              <div class="text-white font-medium">{{ skill.name }}</div>
              <div class="text-slate-500 text-xs">{{ skill.category }}</div>
            </div>
            <div class="flex gap-1">
              <button (click)="openForm(skill)" class="text-slate-400 hover:text-primary p-1 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              <button (click)="delete(skill.id)" class="text-slate-400 hover:text-red-400 p-1 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="h-1.5 bg-surface rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-primary to-accent-blue rounded-full"
                 [style.width.%]="skill.proficiency"></div>
          </div>
          <div class="text-right text-primary font-mono text-xs mt-1">{{ skill.proficiency }}%</div>
        </div>
      }
    </div>
  `,
})
export class SkillsAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly skillsService = inject(SkillsService);

  loading = signal(true);
  saving = signal(false);
  showForm = signal(false);
  editing = signal<Skill | null>(null);
  skills = signal<Skill[]>([]);

  form = this.fb.group({
    name:        ['', Validators.required],
    category:    [''],
    proficiency: [80],
    sortOrder:   [0],
  });

  ngOnInit() { this.load(); }
  load() { this.skillsService.getAll().subscribe(s => { this.skills.set(s); this.loading.set(false); }); }

  openForm(skill?: Skill) {
    this.editing.set(skill ?? null);
    this.form.reset(skill ?? { name: '', category: '', proficiency: 80, sortOrder: 0 });
    this.showForm.set(true);
  }
  closeForm() { this.showForm.set(false); }

  save() {
    if (this.form.invalid) return;
    this.saving.set(true);
    const op = this.editing()
      ? this.skillsService.update(this.editing()!.id, this.form.value as any)
      : this.skillsService.create(this.form.value as any);
    op.subscribe({ next: () => { this.saving.set(false); this.closeForm(); this.load(); }, error: () => this.saving.set(false) });
  }

  delete(id: number) {
    if (!confirm('Delete this skill?')) return;
    this.skillsService.delete(id).subscribe(() => this.load());
  }
}
