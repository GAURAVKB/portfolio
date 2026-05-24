import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <section id="about" class="py-24 bg-surface-card/30">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid md:grid-cols-2 gap-16 items-center">
          <!-- Text -->
          <div>
            <p class="font-mono text-primary text-sm mb-3">// about me</p>
            <h2 class="section-title">I build things that scale.</h2>
            <div class="space-y-4 text-slate-400 leading-relaxed">
              <p>
                With <span class="text-white font-medium">9 years of full-stack experience</span>,
                I specialize in designing and delivering enterprise systems that handle real load —
                from microservice architectures on Spring Boot to reactive Angular frontends.
              </p>
              <p>
                Recently expanded my toolkit with <span class="text-accent-green font-medium">Go</span>
                for high-performance services, and I bring strong DevOps culture to every project —
                CI/CD, containerization, observability, and zero-downtime deployments.
              </p>
              <p>
                I'm available for <span class="text-white font-medium">freelance projects</span> and
                <span class="text-white font-medium">full-time opportunities</span> where I can make
                a real architectural impact.
              </p>
            </div>
            <div class="flex gap-4 mt-8">
              <a href="/assets/resume.pdf" download class="btn-primary text-sm">
                Download Resume
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/gaurav-kumar-barnwal/" target="_blank" class="btn-outline text-sm">
                LinkedIn
              </a>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 gap-6">
            @for (stat of stats; track stat.label) {
              <div class="card text-center">
                <div class="text-4xl font-bold text-primary mb-2 font-mono">{{ stat.value }}</div>
                <div class="text-slate-400 text-sm">{{ stat.label }}</div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class AboutComponent {
  readonly stats = [
    { value: '9+',   label: 'Years Experience' },
    { value: '50+',  label: 'Projects Delivered' },
    { value: '15+',  label: 'Enterprise Clients' },
    { value: '100%', label: 'On-time Delivery' },
  ];
}
