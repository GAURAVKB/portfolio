import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Project } from '../models';

@Injectable({ providedIn: 'root' })
export class ProjectsService extends ApiService {
  getAll(): Observable<Project[]> {
    return this.http.get<Project[]>(this.url('/projects'));
  }
  getFeatured(): Observable<Project[]> {
    return this.http.get<Project[]>(this.url('/projects/featured'));
  }
  getById(id: number): Observable<Project> {
    return this.http.get<Project>(this.url(`/projects/${id}`));
  }
  create(p: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(this.url('/projects'), p);
  }
  update(id: number, p: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(this.url(`/projects/${id}`), p);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/projects/${id}`));
  }
}
