import { Component, HostListener, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgClass],
  template: `
    <nav [ngClass]="scrolled() ? 'bg-surface/95 backdrop-blur border-b border-surface-border shadow-xl' : 'bg-transparent'"
         class="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" class="font-mono text-primary font-bold text-lg tracking-tight">
          Gaurav Kumar
        </a>

        <!-- Desktop nav -->
        <ul class="hidden md:flex items-center gap-8 text-sm font-medium">
          @for (link of links; track link.href) {
            <li>
              <a [href]="link.href" class="text-slate-400 hover:text-white transition-colors duration-200">
                {{ link.label }}
              </a>
            </li>
          }
        </ul>

        <a href="#contact" class="hidden md:inline-flex btn-primary text-sm py-2 px-4">
          Hire Me
        </a>

        <!-- Mobile hamburger -->
        <button (click)="menuOpen.set(!menuOpen())" class="md:hidden text-slate-400 hover:text-white p-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            @if (menuOpen()) {
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            } @else {
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            }
          </svg>
        </button>
      </div>

      <!-- Mobile menu -->
      @if (menuOpen()) {
        <div class="md:hidden bg-surface-card border-b border-surface-border px-6 py-4 flex flex-col gap-4">
          @for (link of links; track link.href) {
            <a [href]="link.href" (click)="menuOpen.set(false)"
               class="text-slate-300 hover:text-white transition-colors text-sm font-medium">
              {{ link.label }}
            </a>
          }
          <a href="#contact" class="btn-primary text-sm text-center" (click)="menuOpen.set(false)">Hire Me</a>
        </div>
      }
    </nav>
  `,
})
export class NavbarComponent {
  scrolled = signal(false);
  menuOpen = signal(false);

  readonly links = [
    { href: '#about',        label: 'About' },
    { href: '#skills',       label: 'Skills' },
    { href: '#projects',     label: 'Projects' },
    { href: '#blog',         label: 'Blog' },
    { href: '#devops',       label: 'DevOps Flex' },
    { href: '#contact',      label: 'Contact' },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 20);
  }
}
