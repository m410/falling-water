import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../paging/page-result';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  created_at: Date;
  updated_at: Date;
  roles: string[];
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/users';

  findPage(page: number = 1, pageSize: number = 10): Observable<PagedResult<User>> {
    return this.http.get<PagedResult<User>>(`${this.baseUrl}?page=${page}&pageSize=${pageSize}`);
  }

  findById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateUserDTO): Observable<User> {
    return this.http.post<User>(this.baseUrl, data);
  }

  update(id: number, data: UpdateUserDTO): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
