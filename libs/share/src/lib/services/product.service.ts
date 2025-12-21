import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product-entity';
import { CreateProductDTO } from './create-product-dto';
import { UpdateProductDTO } from './update-product-dto';
import { ProductAudit } from './product-audit';
import { PagedResult } from '../paging/page-result';

export type { ProductImage } from './product-image';
export type { Product } from './product-entity';
export type { CreateProductDTO } from './create-product-dto';
export type { UpdateProductDTO } from './update-product-dto';
export type { ProductAudit } from './product-audit';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/products';

  findAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  findPage(page: number = 1, pageSize: number = 10): Observable<PagedResult<Product>> {
    return this.http.get<PagedResult<Product>>(`${this.baseUrl}?page=${page}&pageSize=${pageSize}`);
  }

  findById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateProductDTO): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, data);
  }

  update(id: number, data: UpdateProductDTO): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getAuditHistory(id: number): Observable<ProductAudit[]> {
    return this.http.get<ProductAudit[]>(`${this.baseUrl}/${id}/audits`);
  }
}
