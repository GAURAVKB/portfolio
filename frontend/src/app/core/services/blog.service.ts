import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { BlogPost, Page } from '../models';

@Injectable({ providedIn: 'root' })
export class BlogService extends ApiService {
  getPublished(page = 0, size = 9): Observable<Page<BlogPost>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<BlogPost>>(this.url('/blog'), { params });
  }
  getAll(page = 0, size = 20): Observable<Page<BlogPost>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<BlogPost>>(this.url('/blog/all'), { params });
  }
  getBySlug(slug: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(this.url(`/blog/${slug}`));
  }
  create(post: Partial<BlogPost>): Observable<BlogPost> {
    return this.http.post<BlogPost>(this.url('/blog'), post);
  }
  update(id: number, post: Partial<BlogPost>): Observable<BlogPost> {
    return this.http.put<BlogPost>(this.url(`/blog/${id}`), post);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/blog/${id}`));
  }
}
