import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ContactService } from '../../../core/services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  template: `
    <section id="contact" class="py-24 bg-surface-card/30">
      <div class="max-w-2xl mx-auto px-6">
        <p class="font-mono text-primary text-sm mb-3">// let's work together</p>
        <h2 class="section-title">Get In Touch</h2>
        <p class="section-subtitle">
          Have a project in mind? I'd love to hear about it.
          Fill out the form and I'll get back within 24 hours.
        </p>

        @if (success()) {
          <div class="card border-accent-green/40 bg-accent-green/5 text-center py-10 animate-fade-in">
            <svg class="w-12 h-12 text-accent-green mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h3 class="text-white font-semibold text-xl mb-2">Message sent!</h3>
            <p class="text-slate-400">I'll get back to you within 24 hours.</p>
            <button (click)="success.set(false); form.reset()" class="btn-outline text-sm mt-6">Send another</button>
          </div>
        } @else {
          <form [formGroup]="form" (ngSubmit)="submit()" class="card space-y-5">
            <div class="grid sm:grid-cols-2 gap-5">
              <div>
                <label class="label">Name *</label>
                <input formControlName="name" class="input" placeholder="Jane Smith"
                       [ngClass]="{'border-red-500': isInvalid('name')}" />
                @if (isInvalid('name')) {
                  <p class="text-red-400 text-xs mt-1">Name is required</p>
                }
              </div>
              <div>
                <label class="label">Email *</label>
                <input formControlName="email" type="email" class="input" placeholder="jane@company.com"
                       [ngClass]="{'border-red-500': isInvalid('email')}" />
                @if (isInvalid('email')) {
                  <p class="text-red-400 text-xs mt-1">Valid email required</p>
                }
              </div>
            </div>
            <div>
              <label class="label">Subject</label>
              <input formControlName="subject" class="input" placeholder="Project inquiry" />
            </div>
            <div>
              <label class="label">Message *</label>
              <textarea formControlName="message" rows="5" class="input resize-none"
                        placeholder="Tell me about your project, timeline, and budget..."
                        [ngClass]="{'border-red-500': isInvalid('message')}"></textarea>
              @if (isInvalid('message')) {
                <p class="text-red-400 text-xs mt-1">Message is required</p>
              }
            </div>

            @if (error()) {
              <div class="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                {{ error() }}
              </div>
            }

            <button type="submit" class="btn-primary w-full justify-center py-3.5" [disabled]="submitting()">
              @if (submitting()) {
                <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Sending...
              } @else {
                Send Message
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              }
            </button>
          </form>
        }
      </div>
    </section>
  `,
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);

  submitting = signal(false);
  success = signal(false);
  error = signal('');

  form = this.fb.group({
    name:    ['', [Validators.required, Validators.maxLength(255)]],
    email:   ['', [Validators.required, Validators.email]],
    subject: [''],
    message: ['', [Validators.required, Validators.maxLength(5000)]],
  });

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.error.set('');

    this.contactService.submit(this.form.value as any).subscribe({
      next: () => { this.submitting.set(false); this.success.set(true); },
      error: () => {
        this.submitting.set(false);
        this.error.set('Something went wrong. Please try emailing me directly.');
      },
    });
  }
}
