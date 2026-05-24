import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ServiceMetrics, GitHubStats } from '../models';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class MetricsService extends ApiService {
  getMetrics(): Observable<ServiceMetrics> {
    return this.http.get<ServiceMetrics>(this.goUrl('/metrics'));
  }
  getApiHealth(): Observable<{ status: string; timestamp: string }> {
    return this.http.get<{ status: string; timestamp: string }>(this.url('/health'));
  }
  getGitHubStats(): Observable<GitHubStats> {
    return this.http.get<GitHubStats>(this.goUrl(`/github/${environment.githubUsername}`));
  }
  getCICDStatus(): Observable<any> {
    return this.http.get<any>(this.goUrl('/cicd/status'));
  }
}
