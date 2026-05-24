import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { Testimonial } from '../../../../core/models';

@Component({
  selector: 'app-testimonials-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-white">Testimonials</h1>
      <button (click)="openForm()" class="btn-primary text-sm py-2 px-4">+ Add Testimonial</button>
    </div>

    @if (showForm()) {
      <div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div class="bg-surface-card border border-surface-border rounded-xl w-full max-w-lg p-6">
          <h2 class="text-white font-semibold mb-6">{{ editing() ? 'Edit' : 'New' }} Testimonial</h2>
          <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="label">Name *</label>
                <input formControlName="name" class="input text-sm" />
              </div>
              <div>
                <label class="label">Role</label>
                <input formControlName="role" class="input text-sm" placeholder="CTO" />
              </div>
            </div>
            <div>
              <label class="label">Company</label>
              <input formControlName="company" class="input text-sm" />
            </div>
            <div>
              <label class="label">Testimonial *</label>
              <textarea formControlName="content" rows="4" class="input text-sm resize-none"></textarea>
            </div>
            <div>
              <label class="label">Avatar URL</label>
              <input formControlName="avatarUrl" class="input text-sm" />
            </div>
            <div class="flex items-center gap-3">
              <input type="checkbox" formControlName="visible" class="accent-primary w-4 h-4" id="visible"/>
              <label for="visible" class="text-slate-300 text-sm cursor-pointer">Visible on portfolio</label>
            </div>
            <div class="flex gap-3 pt-4 border-t border-surface-border">
              <button type="submit" class="btn-primary text-sm" [disabled]="saving()">{{ saving() ? 'Saving...' : 'Save' }}</button>
              <button type="button" (click)="closeForm()" class="btn-outline text-sm">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    }

    <div class="grid sm:grid-cols-2 gap-4">
      @for (t of testimonials(); track t.id) {
        <div class="card">
          <p class="text-slate-300 text-sm italic mb-4">"{{ t.content }}"</p>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-white font-medium text-sm">{{ t.name }}</div>
              <div class="text-slate-500 text-xs">{{ t.role }}{{ t.company ? ', ' + t.company : '' }}</div>
            </div>
            <div class="flex gap-1">
              <span [class]="t.visible ? 'text-accent-green' : 'text-slate-600'" class="text-xs font-mono mr-2">
                {{ t.visible ? 'visible' : 'hidden' }}
              </span>
              <button (click)="openForm(t)" class="text-slate-400 hover:text-primary p-1 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              </button>
              <button (click)="delete(t.id)" class="text-slate-400 hover:text-red-400 p-1 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class TestimonialsAdminComponent extends ApiService implements OnInit {
  private readonly fb = inject(FormBuilder);
  loading = signal(true);
  saving = signal(false);
  showForm = signal(false);
  editing = signal<Testimonial | null>(null);
  testimonials = signal<Testimonial[]>([]);

  form = this.fb.group({
    name: ['', Validators.required], role: [''], company: [''],
    content: ['', Validators.required], avatarUrl: [''], visible: [true],
  });

  ngOnInit() { this.load(); }
  load() { this.http.get<Testimonial[]>(this.url('/testimonials/all')).subscribe(t => { this.testimonials.set(t); this.loading.set(false); }); }
  openForm(t?: Testimonial) { this.editing.set(t ?? null); this.form.reset(t ?? { name: '', role: '', company: '', content: '', avatarUrl: '', visible: true }); this.showForm.set(true); }
  closeForm() { this.showForm.set(false); }
  save() {
    if (this.form.invalid) return;
    this.saving.set(true);
    const op = this.editing()
      ? this.http.put(this.url(`/testimonials/${this.editing()!.id}`), this.form.value)
      : this.http.post(this.url('/testimonials'), this.form.value);
    op.subscribe({ next: () => { this.saving.set(false); this.closeForm(); this.load(); }, error: () => this.saving.set(false) });
  }
  delete(id: number) {
    if (!confirm('Delete?')) return;
    this.http.delete(this.url(`/testimonials/${id}`)).subscribe(() => this.load());
  }
}
