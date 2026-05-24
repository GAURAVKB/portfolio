import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="border-t border-surface-border bg-surface py-10">
      <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="font-mono text-primary font-semibold">Gaurav Kumar</p>
        <p class="text-slate-500 text-sm">
          Built with Angular · Spring Boot · Go · PostgreSQL · Deployed on Vercel + Render
        </p>
        <p class="text-slate-600 text-xs">© {{ year }} · All rights reserved</p>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
