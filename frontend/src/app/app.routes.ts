import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/public/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./features/public/blog-detail.component').then(m => m.BlogDetailComponent),
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/admin/pages/projects/projects-admin.component').then(m => m.ProjectsAdminComponent),
      },
      {
        path: 'skills',
        loadComponent: () => import('./features/admin/pages/skills/skills-admin.component').then(m => m.SkillsAdminComponent),
      },
      {
        path: 'blog',
        loadComponent: () => import('./features/admin/pages/blog/blog-admin.component').then(m => m.BlogAdminComponent),
      },
      {
        path: 'testimonials',
        loadComponent: () => import('./features/admin/pages/testimonials/testimonials-admin.component').then(m => m.TestimonialsAdminComponent),
      },
      {
        path: 'contacts',
        loadComponent: () => import('./features/admin/pages/contacts/contacts-admin.component').then(m => m.ContactsAdminComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
