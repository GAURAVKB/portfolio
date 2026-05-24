import { Component, OnInit, OnDestroy, signal } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <section class="min-h-screen flex items-center justify-center relative overflow-hidden bg-surface pt-16">
      <!-- Background grid -->
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40"></div>
      <!-- Gradient orb -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="relative z-10 max-w-4xl mx-auto px-6 text-center animate-fade-in">
        <!-- Status badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-green/10 border border-accent-green/30 text-accent-green text-sm font-mono mb-8">
          <span class="w-2 h-2 rounded-full bg-accent-green animate-pulse-slow"></span>
          Available for freelance &amp; full-time
        </div>

        <!-- Terminal-style name -->
        <div class="font-mono text-slate-400 text-lg mb-4">
          <span class="text-accent-green">$</span> whoami
        </div>

        <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
          Gaurav Kumar
        </h1>

        <div class="text-2xl md:text-3xl font-mono text-primary-light mb-6 h-10">
          <span>{{ displayedText() }}</span>
          <span class="animate-blink text-primary">|</span>
        </div>

        <p class="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          9 years building enterprise-grade systems with
          <span class="text-white font-medium">Java · Spring Boot · Angular · Go</span>.
          I turn complex requirements into clean, scalable software.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#projects" class="btn-primary text-base px-8 py-3.5">
            View My Work
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
          <a href="#contact" class="btn-outline text-base px-8 py-3.5">
            Get In Touch
          </a>
        </div>

        <!-- Tech stack chips -->
        <div class="flex flex-wrap justify-center gap-3 mt-14">
          @for (tech of techStack; track tech) {
            <span class="badge">{{ tech }}</span>
          }
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600">
        <span class="text-xs font-mono">scroll</span>
        <div class="w-px h-12 bg-gradient-to-b from-slate-600 to-transparent animate-pulse"></div>
      </div>
    </section>
  `,
})
export class HeroComponent implements OnInit, OnDestroy {
  displayedText = signal('');

  readonly roles = [
    'Senior Full-Stack Developer',
    'Java / Spring Boot Expert',
    'Angular Architect',
    'Go Developer',
    'DevOps Engineer',
  ];

  readonly techStack = [
    'Java 21', 'Spring Boot 3', 'Angular 18', 'Go', 'PostgreSQL',
    'Docker', 'Kubernetes', 'GitHub Actions', 'AWS', 'Microservices',
  ];

  private roleIdx = 0;
  private charIdx = 0;
  private deleting = false;
  private timer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit() { this.tick(); }
  ngOnDestroy() { if (this.timer) clearTimeout(this.timer); }

  private tick() {
    const current = this.roles[this.roleIdx];
    if (!this.deleting) {
      this.displayedText.set(current.slice(0, ++this.charIdx));
      if (this.charIdx === current.length) {
        this.deleting = true;
        this.timer = setTimeout(() => this.tick(), 2000);
        return;
      }
    } else {
      this.displayedText.set(current.slice(0, --this.charIdx));
      if (this.charIdx === 0) {
        this.deleting = false;
        this.roleIdx = (this.roleIdx + 1) % this.roles.length;
      }
    }
    this.timer = setTimeout(() => this.tick(), this.deleting ? 50 : 80);
  }
}
