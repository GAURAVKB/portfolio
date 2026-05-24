import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BlogService } from '../../../core/services/blog.service';
import { BlogPost } from '../../../core/models';

@Component({
  selector: 'app-blog-preview',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <section id="blog" class="py-24 bg-surface-card/30">
      <div class="max-w-6xl mx-auto px-6">
        <p class="font-mono text-primary text-sm mb-3">// thoughts & articles</p>
        <h2 class="section-title">Blog</h2>
        <p class="section-subtitle">Technical deep-dives, architecture decisions, and lessons from production.</p>

        @if (loading()) {
          <div class="grid md:grid-cols-3 gap-6">
            @for (i of [1,2,3]; track i) {
              <div class="card animate-pulse h-56"></div>
            }
          </div>
        }

        @if (!loading() && posts().length > 0) {
          <div class="grid md:grid-cols-3 gap-6">
            @for (post of posts(); track post.id) {
              <a [routerLink]="['/blog', post.slug]" class="card group cursor-pointer flex flex-col gap-4">
                @if (post.coverImageUrl) {
                  <img [src]="post.coverImageUrl" [alt]="post.title"
                       class="w-full h-40 object-cover rounded-lg opacity-80 group-hover:opacity-100 transition-opacity"/>
                }
                <div class="flex-1 flex flex-col">
                  <span class="text-slate-500 text-xs font-mono mb-2">
                    {{ post.createdAt | date:'mediumDate' }}
                  </span>
                  <h3 class="text-white font-semibold text-lg leading-tight group-hover:text-primary transition-colors mb-2">
                    {{ post.title }}
                  </h3>
                  <p class="text-slate-400 text-sm line-clamp-3 flex-1">{{ post.excerpt }}</p>
                  <span class="text-primary text-sm font-medium mt-4 group-hover:underline">Read more →</span>
                </div>
              </a>
            }
          </div>
        }

        @if (!loading() && posts().length === 0) {
          <div class="text-center py-12 text-slate-500">
            <p>Articles coming soon. Check back later!</p>
          </div>
        }
      </div>
    </section>
  `,
})
export class BlogPreviewComponent implements OnInit {
  private readonly blogService = inject(BlogService);
  loading = signal(true);
  posts = signal<BlogPost[]>([]);

  ngOnInit() {
    this.blogService.getPublished(0, 3).subscribe({
      next: p => { this.posts.set(p.content); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
