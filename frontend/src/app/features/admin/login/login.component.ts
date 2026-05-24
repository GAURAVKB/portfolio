import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-surface flex items-center justify-center px-4">
      <div class="w-full max-w-sm">
        <div class="text-center mb-8">
          <div class="font-mono text-primary font-bold text-2xl mb-2">&lt;Admin /&gt;</div>
          <p class="text-slate-500 text-sm">Portfolio CMS — restricted access</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="login()" class="card space-y-4">
          <div>
            <label class="label">Username</label>
            <input formControlName="username" class="input" placeholder="admin" autocomplete="username" />
          </div>
          <div>
            <label class="label">Password</label>
            <input formControlName="password" type="password" class="input" placeholder="••••••••" autocomplete="current-password" />
          </div>

          @if (error()) {
            <div class="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
              {{ error() }}
            </div>
          }

          <button type="submit" class="btn-primary w-full justify-center py-3" [disabled]="loading()">
            {{ loading() ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <p class="text-center text-slate-600 text-xs mt-6">
          <a href="/" class="hover:text-primary transition-colors">← Back to portfolio</a>
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = signal(false);
  error = signal('');

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  login() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');
    const { username, password } = this.form.value;
    this.authService.login(username!, password!).subscribe({
      next: () => this.router.navigate(['/admin/dashboard']),
      error: () => {
        this.loading.set(false);
        this.error.set('Invalid username or password.');
      },
    });
  }
}
