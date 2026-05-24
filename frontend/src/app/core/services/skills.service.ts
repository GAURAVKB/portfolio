import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Skill } from '../models';

@Injectable({ providedIn: 'root' })
export class SkillsService extends ApiService {
  getAll(): Observable<Skill[]> {
    return this.http.get<Skill[]>(this.url('/skills'));
  }
  create(s: Partial<Skill>): Observable<Skill> {
    return this.http.post<Skill>(this.url('/skills'), s);
  }
  update(id: number, s: Partial<Skill>): Observable<Skill> {
    return this.http.put<Skill>(this.url(`/skills/${id}`), s);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/skills/${id}`));
  }
}
