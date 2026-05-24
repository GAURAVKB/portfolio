import { Component, OnInit, inject, signal } from '@angular/core';
import { SkillsService } from '../../../core/services/skills.service';
import { Skill } from '../../../core/models';

interface SkillGroup {
  category: string;
  skills: Skill[];
}

@Component({
  selector: 'app-skills',
  standalone: true,
  template: `
    <section id="skills" class="py-24 bg-surface">
      <div class="max-w-6xl mx-auto px-6">
        <p class="font-mono text-primary text-sm mb-3">// skills &amp; expertise</p>
        <h2 class="section-title">What I work with</h2>
        <p class="section-subtitle">My core technical stack, built over 9 years of production experience.</p>

        @if (loading()) {
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (i of [1,2,3,4,5,6]; track i) {
              <div class="card animate-pulse h-32 bg-surface-card/50"></div>
            }
          </div>
        }

        @if (!loading() && groups().length > 0) {
          @for (group of groups(); track group.category) {
            <div class="mb-10">
              <h3 class="text-slate-300 font-semibold text-sm uppercase tracking-widest mb-4 font-mono">
                {{ group.category }}
              </h3>
              <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                @for (skill of group.skills; track skill.id) {
                  <div class="card group">
                    <div class="flex justify-between items-center mb-3">
                      <span class="text-white font-medium">{{ skill.name }}</span>
                      <span class="font-mono text-primary text-sm">{{ skill.proficiency }}%</span>
                    </div>
                    <div class="h-1.5 bg-surface rounded-full overflow-hidden">
                      <div
                        class="h-full bg-gradient-to-r from-primary to-accent-blue rounded-full transition-all duration-1000"
                        [style.width.%]="skill.proficiency">
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        }

        @if (!loading() && groups().length === 0) {
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (skill of fallbackSkills; track skill.name) {
              <div class="card">
                <div class="flex justify-between items-center mb-3">
                  <span class="text-white font-medium">{{ skill.name }}</span>
                  <span class="font-mono text-primary text-sm">{{ skill.proficiency }}%</span>
                </div>
                <div class="h-1.5 bg-surface rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-primary to-accent-blue rounded-full"
                       [style.width.%]="skill.proficiency"></div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class SkillsComponent implements OnInit {
  private readonly skillsService = inject(SkillsService);

  loading = signal(true);
  groups = signal<SkillGroup[]>([]);

  readonly fallbackSkills = [
    { name: 'Java / Spring Boot',  proficiency: 95 },
    { name: 'Angular',             proficiency: 92 },
    { name: 'Go (Golang)',         proficiency: 70 },
    { name: 'PostgreSQL',          proficiency: 88 },
    { name: 'Docker / Kubernetes', proficiency: 85 },
    { name: 'GitHub Actions',      proficiency: 88 },
  ];

  ngOnInit() {
    this.skillsService.getAll().subscribe({
      next: skills => {
        const map = new Map<string, Skill[]>();
        skills.forEach(s => {
          const cat = s.category || 'General';
          const existing = map.get(cat) ?? [];
          map.set(cat, [...existing, s]);
        });
        const groups: SkillGroup[] = [];
        map.forEach((skillList, category) => groups.push({ category, skills: skillList }));
        this.groups.set(groups);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
