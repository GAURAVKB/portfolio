import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ContactService } from '../../../../core/services/contact.service';
import { RateResponse } from '../../../../core/models';

@Component({
  selector: 'app-rate-calculator',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe],
  template: `
    <div class="card flex flex-col gap-5">
      <div>
        <h3 class="text-white font-semibold mb-1">Project Rate Estimator</h3>
        <p class="text-slate-500 text-xs">Get an instant ballpark estimate for your project.</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="calculate()" class="flex flex-col gap-4">
        <div>
          <label class="label text-xs">Project Type</label>
          <select formControlName="projectType" class="input text-sm">
            <option value="mvp">MVP / Prototype</option>
            <option value="startup">Startup Product</option>
            <option value="enterprise">Enterprise System</option>
          </select>
        </div>

        <div>
          <label class="label text-xs">Tech Stack</label>
          <input formControlName="techStack" class="input text-sm" placeholder="Java, Spring Boot, Angular..." />
        </div>

        <div>
          <label class="label text-xs">Timeline (weeks)</label>
          <input formControlName="timelineWeeks" type="number" min="1" max="52" class="input text-sm" />
        </div>

        <div class="space-y-2">
          <label class="flex items-center gap-2 cursor-pointer text-slate-400 text-sm">
            <input type="checkbox" formControlName="includesDevOps" class="accent-primary w-4 h-4"/>
            Includes DevOps / CI/CD setup
          </label>
          <label class="flex items-center gap-2 cursor-pointer text-slate-400 text-sm">
            <input type="checkbox" formControlName="includesDesign" class="accent-primary w-4 h-4"/>
            Includes UI/UX design
          </label>
        </div>

        <button type="submit" class="btn-primary text-sm justify-center py-2.5" [disabled]="loading()">
          {{ loading() ? 'Calculating...' : 'Get Estimate' }}
        </button>
      </form>

      @if (result()) {
        <div class="bg-surface border border-primary/30 rounded-lg p-4 space-y-2 animate-fade-in">
          <div class="flex justify-between items-center">
            <span class="text-slate-400 text-sm">Estimated Range</span>
            <span class="text-white font-bold font-mono text-lg">
              {{ formatRange() }}
            </span>
          </div>
          <div class="text-slate-500 text-xs">{{ result()!.breakdown }}</div>
          <div class="text-slate-600 text-xs italic">{{ result()!.disclaimer }}</div>
          <a href="#contact" class="btn-primary text-xs py-2 justify-center w-full mt-2">
            Book a Scoping Call
          </a>
        </div>
      }
    </div>
  `,
})
export class RateCalculatorComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);
  private readonly decimalPipe = inject(DecimalPipe);

  loading = signal(false);
  result = signal<RateResponse | null>(null);

  form = this.fb.group({
    projectType:    ['startup'],
    techStack:      ['Java, Spring Boot, Angular', Validators.required],
    timelineWeeks:  [8, [Validators.required, Validators.min(1)]],
    includesDevOps: [false],
    includesDesign: [false],
  });

  formatRange(): string {
    const r = this.result();
    if (!r) return '';
    const min = this.decimalPipe.transform(r.minRate, '1.0-0');
    const max = this.decimalPipe.transform(r.maxRate, '1.0-0');
    return `$${min} – $${max}`;
  }

  calculate() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.contactService.calculateRate(this.form.value as any).subscribe({
      next: r => { this.result.set(r); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
