import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-surface flex">
      <!-- Sidebar -->
      <aside [class.translate-x-0]="sidebarOpen()"
             [class.-translate-x-full]="!sidebarOpen()"
             class="fixed lg:static lg:translate-x-0 z-40 w-64 min-h-screen bg-surface-card border-r border-surface-border
                    flex flex-col transition-transform duration-300">
        <div class="p-6 border-b border-surface-border">
          <div class="font-mono text-primary font-bold">&lt;Gaurav / Admin&gt;</div>
          <div class="text-slate-500 text-xs mt-1">Portfolio Manager</div>
        </div>

        <nav class="flex-1 p-4 space-y-1">
          @for (item of navItems; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="bg-primary/10 text-primary border-primary/30"
               class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-border/30
                      transition-colors text-sm border border-transparent" (click)="sidebarOpen.set(false)">
              <span [innerHTML]="item.icon" class="w-5 h-5 shrink-0"></span>
              {{ item.label }}
            </a>
          }
        </nav>

        <div class="p-4 border-t border-surface-border">
          <button (click)="logout()" class="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg
                  text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors text-sm">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <!-- Mobile overlay -->
      @if (sidebarOpen()) {
        <div class="fixed inset-0 bg-black/50 z-30 lg:hidden" (click)="sidebarOpen.set(false)"></div>
      }

      <!-- Main content -->
      <div class="flex-1 flex flex-col min-w-0">
        <header class="bg-surface-card border-b border-surface-border px-6 h-14 flex items-center justify-between lg:justify-end">
          <button class="lg:hidden text-slate-400 hover:text-white p-1" (click)="sidebarOpen.set(!sidebarOpen())">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <a href="/" target="_blank" class="text-slate-400 hover:text-primary text-sm transition-colors">
            View Portfolio →
          </a>
        </header>
        <main class="flex-1 p-6 overflow-auto">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AdminLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  sidebarOpen = signal(false);

  readonly navItems = [
    { path: '/admin/dashboard',    label: 'Dashboard',    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>' },
    { path: '/admin/projects',     label: 'Projects',     icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>' },
    { path: '/admin/skills',       label: 'Skills',       icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>' },
    { path: '/admin/blog',         label: 'Blog',         icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>' },
    { path: '/admin/testimonials', label: 'Testimonials', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>' },
    { path: '/admin/contacts',     label: 'Messages',     icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>' },
  ];

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
