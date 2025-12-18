import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../../../../../apps/backoffice/src/app/shared/types';

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  display_order: number;
  created_at: Date;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  category_id: number | null;
  created_at: Date;
  updated_at: Date;
  images: ProductImage[];
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: number | null;
  images?: { image_url: string; display_order?: number }[];
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  stock_quantity?: number;
  category_id?: number;
  images?: { id?: number; image_url: string; display_order?: number }[];
}

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
}
