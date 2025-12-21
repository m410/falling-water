import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../paging/page-result';

export interface System {
  id: number;
  name: string;
  description: string;
  min_flow_rate_cms: number;
  max_flow_rate_cms: number;
  min_head_mt: number;
  max_head_mt: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  product_ids: number[];
}

export interface CreateSystemDTO {
  name: string;
  description: string;
  min_flow_rate_cms: number;
  max_flow_rate_cms: number;
  min_head_mt: number;
  max_head_mt: number;
  status: string;
  product_ids?: number[];
}

export interface UpdateSystemDTO {
  name?: string;
  description?: string;
  min_flow_rate_cms?: number;
  max_flow_rate_cms?: number;
  min_head_mt?: number;
  max_head_mt?: number;
  status?: string;
  product_ids?: number[];
}

@Injectable({ providedIn: 'root' })
export class SystemService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/systems';

  findAll(): Observable<System[]> {
    return this.http.get<System[]>(this.baseUrl);
  }

  findPage(page: number = 1, pageSize: number = 10): Observable<PagedResult<System>> {
    return this.http.get<PagedResult<System>>(`${this.baseUrl}?page=${page}&pageSize=${pageSize}`);
  }

  findById(id: number): Observable<System> {
    return this.http.get<System>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateSystemDTO): Observable<System> {
    return this.http.post<System>(this.baseUrl, data);
  }

  update(id: number, data: UpdateSystemDTO): Observable<System> {
    return this.http.put<System>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
