import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  protected readonly http = inject(HttpClient);
  protected readonly base = environment.apiUrl;
  protected readonly goBase = environment.goUrl;

  protected url(path: string): string {
    return `${this.base}${path}`;
  }

  protected goUrl(path: string): string {
    return `${this.goBase}${path}`;
  }
}
