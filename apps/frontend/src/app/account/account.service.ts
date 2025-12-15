import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountProfile } from './account.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);

  getProfile(): Observable<AccountProfile> {
    return this.http.get<AccountProfile>('/api/profile');
  }
}
