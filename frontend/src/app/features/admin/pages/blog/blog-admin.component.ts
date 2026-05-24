import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BlogService } from '../../../../core/services/blog.service';
import { BlogPost } from '../../../../core/models';

@Component({
  selector: 'app-blog-admin',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  template: `
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-white">Blog Posts</h1>
      <button (click)="openForm()" class="btn-primary text-sm py-2 px-4">+ New Post</button>
    </div>

    @if (showForm()) {
      <div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div class="bg-surface-card border border-surface-border rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
          <h2 class="text-white font-semibold text-lg mb-6">{{ editing() ? 'Edit' : 'New' }} Post</h2>
          <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="label">Title *</label>
                <input formControlName="title" class="input text-sm" />
              </div>
              <div>
                <label class="label">Slug *</label>
                <input formControlName="slug" class="input text-sm" placeholder="my-post-title" />
              </div>
            </div>
            <div>
              <label class="label">Excerpt</label>
              <textarea formControlName="excerpt" rows="2" class="input text-sm resize-none"></textarea>
            </div>
            <div>
              <label class="label">Content (HTML)</label>
              <textarea formControlName="content" rows="10" class="input text-sm resize-none font-mono"></textarea>
            </div>
            <div>
              <label class="label">Cover Image URL</label>
              <input formControlName="coverImageUrl" class="input text-sm" />
            </div>
            <div class="flex items-center gap-3">
              <input type="checkbox" formControlName="published" class="accent-primary w-4 h-4" id="published"/>
              <label for="published" class="text-slate-300 text-sm cursor-pointer">Published (visible to public)</label>
            </div>
            <div class="flex gap-3 pt-4 border-t border-surface-border">
              <button type="submit" class="btn-primary text-sm" [disabled]="saving()">
                {{ saving() ? 'Saving...' : 'Save Post' }}
              </button>
              <button type="button" (click)="closeForm()" class="btn-outline text-sm">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    }

    <div class="space-y-3">
      @for (post of posts(); track post.id) {
        <div class="card flex items-center gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h3 class="text-white font-medium truncate">{{ post.title }}</h3>
              <span [class]="post.published ? 'bg-accent-green/20 text-accent-green' : 'bg-slate-700 text-slate-400'"
                    class="px-2 py-0.5 rounded text-xs font-mono shrink-0">
                {{ post.published ? 'live' : 'draft' }}
              </span>
            </div>
            <p class="text-slate-500 text-xs mt-1">{{ post.createdAt | date:'mediumDate' }} · /blog/{{ post.slug }}</p>
          </div>
          <div class="flex gap-2 shrink-0">
            <button (click)="openForm(post)" class="text-slate-400 hover:text-primary transition-colors p-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
            <button (click)="delete(post.id)" class="text-slate-400 hover:text-red-400 transition-colors p-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      }
      @if (posts().length === 0 && !loading()) {
        <div class="text-center py-16 text-slate-500">No posts yet. Write your first article!</div>
      }
    </div>
  `,
})
export class BlogAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly blogService = inject(BlogService);

  loading = signal(true);
  saving = signal(false);
  showForm = signal(false);
  editing = signal<BlogPost | null>(null);
  posts = signal<BlogPost[]>([]);

  form = this.fb.group({
    title:         ['', Validators.required],
    slug:          ['', Validators.required],
    excerpt:       [''],
    content:       [''],
    coverImageUrl: [''],
    published:     [false],
  });

  ngOnInit() { this.load(); }
  load() { this.blogService.getAll().subscribe(p => { this.posts.set(p.content); this.loading.set(false); }); }

  openForm(post?: BlogPost) {
    this.editing.set(post ?? null);
    this.form.reset(post ?? { title: '', slug: '', excerpt: '', content: '', coverImageUrl: '', published: false });
    this.showForm.set(true);
  }
  closeForm() { this.showForm.set(false); }

  save() {
    if (this.form.invalid) return;
    this.saving.set(true);
    const op = this.editing()
      ? this.blogService.update(this.editing()!.id, this.form.value as any)
      : this.blogService.create(this.form.value as any);
    op.subscribe({ next: () => { this.saving.set(false); this.closeForm(); this.load(); }, error: () => this.saving.set(false) });
  }

  delete(id: number) {
    if (!confirm('Delete this post?')) return;
    this.blogService.delete(id).subscribe(() => this.load());
  }
}
