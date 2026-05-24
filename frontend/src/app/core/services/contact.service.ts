import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { RateRequest, RateResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ContactService extends ApiService {
  submit(payload: { name: string; email: string; subject: string; message: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.url('/contact'), payload);
  }
  calculateRate(req: RateRequest): Observable<RateResponse> {
    return this.http.post<RateResponse>(this.url('/rate-calculator'), req);
  }
}
