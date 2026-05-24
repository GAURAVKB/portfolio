import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { HeroComponent } from './sections/hero.component';
import { AboutComponent } from './sections/about.component';
import { SkillsComponent } from './sections/skills.component';
import { ProjectsComponent } from './sections/projects.component';
import { GithubFeedComponent } from './sections/github-feed.component';
import { BlogPreviewComponent } from './sections/blog-preview.component';
import { TestimonialsComponent } from './sections/testimonials.component';
import { DevopsWidgetsComponent } from './sections/devops/devops-widgets.component';
import { ContactComponent } from './sections/contact.component';
import { FooterComponent } from '../../shared/components/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    GithubFeedComponent,
    BlogPreviewComponent,
    TestimonialsComponent,
    DevopsWidgetsComponent,
    ContactComponent,
    FooterComponent,
  ],
  template: `
    <app-navbar />
    <main>
      <app-hero />
      <app-about />
      <app-skills />
      <app-projects />
      <app-github-feed />
      <app-blog-preview />
      <app-testimonials />
      <app-devops-widgets />
      <app-contact />
    </main>
    <app-footer />
  `,
})
export class HomeComponent {}
