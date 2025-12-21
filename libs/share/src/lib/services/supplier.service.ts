import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../paging/page-result';

export interface Supplier {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateSupplierDTO {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  notes?: string;
}

export interface UpdateSupplierDTO {
  name?: string;
  email?: string;
  phone?: string;
  website?: string;
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class SupplierService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/suppliers';

  findAll(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.baseUrl);
  }

  findPage(page: number = 1, pageSize: number = 10): Observable<PagedResult<Supplier>> {
    return this.http.get<PagedResult<Supplier>>(`${this.baseUrl}?page=${page}&pageSize=${pageSize}`);
  }

  findById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateSupplierDTO): Observable<Supplier> {
    return this.http.post<Supplier>(this.baseUrl, data);
  }

  update(id: number, data: UpdateSupplierDTO): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
