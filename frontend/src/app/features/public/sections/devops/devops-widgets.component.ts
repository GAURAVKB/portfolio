import { Component } from '@angular/core';
import { HealthWidgetComponent } from './health-widget.component';
import { CicdWidgetComponent } from './cicd-widget.component';
import { RateCalculatorComponent } from './rate-calculator.component';

@Component({
  selector: 'app-devops-widgets',
  standalone: true,
  imports: [HealthWidgetComponent, CicdWidgetComponent, RateCalculatorComponent],
  template: `
    <section id="devops" class="py-24 bg-surface">
      <div class="max-w-6xl mx-auto px-6">
        <p class="font-mono text-primary text-sm mb-3">// live system metrics</p>
        <h2 class="section-title">DevOps Flex</h2>
        <p class="section-subtitle">
          These widgets connect to my live microservices — real infrastructure, real data.
          This is what enterprise-grade DevOps culture looks like in practice.
        </p>

        <div class="grid lg:grid-cols-3 gap-6">
          <app-health-widget />
          <app-cicd-widget />
          <app-rate-calculator />
        </div>
      </div>
    </section>
  `,
})
export class DevopsWidgetsComponent {}
