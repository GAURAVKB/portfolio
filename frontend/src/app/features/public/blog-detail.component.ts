import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BlogService } from '../../core/services/blog.service';
import { BlogPost } from '../../core/models';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { FooterComponent } from '../../shared/components/footer.component';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, NavbarComponent, FooterComponent],
  template: `
    <app-navbar />
    <main class="min-h-screen bg-surface pt-24 pb-16">
      @if (loading()) {
        <div class="max-w-3xl mx-auto px-6">
          <div class="animate-pulse space-y-6">
            <div class="h-10 bg-surface-card rounded w-3/4"></div>
            <div class="h-4 bg-surface-card rounded w-1/3"></div>
            <div class="h-64 bg-surface-card rounded"></div>
          </div>
        </div>
      }

      @if (!loading() && post()) {
        <article class="max-w-3xl mx-auto px-6 animate-fade-in">
          @if (post()!.coverImageUrl) {
            <img [src]="post()!.coverImageUrl" [alt]="post()!.title"
                 class="w-full h-64 object-cover rounded-xl mb-8 opacity-90"/>
          }
          <a routerLink="/" class="text-primary text-sm hover:underline font-mono mb-6 inline-block">← Back home</a>
          <h1 class="text-4xl font-bold text-white mb-4 leading-tight">{{ post()!.title }}</h1>
          <div class="flex items-center gap-4 text-slate-500 text-sm mb-10 pb-8 border-b border-surface-border">
            <span>{{ post()!.createdAt | date:'longDate' }}</span>
          </div>
          <div class="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed"
               [innerHTML]="post()!.content"></div>
        </article>
      }

      @if (!loading() && !post()) {
        <div class="max-w-3xl mx-auto px-6 text-center py-24">
          <h2 class="text-2xl text-white mb-4">Post not found</h2>
          <a routerLink="/" class="btn-primary">← Go home</a>
        </div>
      }
    </main>
    <app-footer />
  `,
})
export class BlogDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly blogService = inject(BlogService);

  loading = signal(true);
  post = signal<BlogPost | null>(null);

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.blogService.getBySlug(slug).subscribe({
      next: p => { this.post.set(p); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
