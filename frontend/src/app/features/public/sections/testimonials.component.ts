import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Testimonial } from '../../../core/models';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  template: `
    <section class="py-24 bg-surface">
      <div class="max-w-6xl mx-auto px-6">
        <p class="font-mono text-primary text-sm mb-3">// social proof</p>
        <h2 class="section-title">What clients say</h2>

        @if (!loading() && testimonials().length > 0) {
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (t of testimonials(); track t.id) {
              <div class="card relative">
                <svg class="w-8 h-8 text-primary/30 absolute top-6 right-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <p class="text-slate-300 leading-relaxed mb-6 italic">"{{ t.content }}"</p>
                <div class="flex items-center gap-3">
                  @if (t.avatarUrl) {
                    <img [src]="t.avatarUrl" [alt]="t.name" class="w-10 h-10 rounded-full border border-surface-border"/>
                  } @else {
                    <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {{ t.name.charAt(0) }}
                    </div>
                  }
                  <div>
                    <div class="text-white font-medium text-sm">{{ t.name }}</div>
                    <div class="text-slate-500 text-xs">{{ t.role }}{{ t.company ? ', ' + t.company : '' }}</div>
                  </div>
                </div>
              </div>
            }
          </div>
        }

        @if (!loading() && testimonials().length === 0) {
          <div class="text-center py-12 text-slate-500">Testimonials coming soon.</div>
        }
      </div>
    </section>
  `,
})
export class TestimonialsComponent extends ApiService implements OnInit {
  loading = signal(true);
  testimonials = signal<Testimonial[]>([]);

  ngOnInit() {
    this.http.get<Testimonial[]>(this.url('/testimonials')).subscribe({
      next: t => { this.testimonials.set(t); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
