import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../../../../../apps/backoffice/src/app/shared/types';

export interface Order {
  id: number;
  user_id: number | null;
  status: string;
  total_amount: number;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: number;
  order_id: number | null;
  product_id: number | null;
  quantity: number;
  unit_price: number;
}

export interface CreateOrderDTO {
  user_id?: number;
  status?: string;
  total_amount: number;
}

export interface UpdateOrderDTO {
  user_id?: number;
  status?: string;
  total_amount?: number;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/orders';

  findAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }

  findPage(page: number = 1, pageSize: number = 10): Observable<PagedResult<Order>> {
    return this.http.get<PagedResult<Order>>(`${this.baseUrl}?page=${page}&pageSize=${pageSize}`);
  }

  findById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateOrderDTO): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, data);
  }

  update(id: number, data: UpdateOrderDTO): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getOrderItems(orderId: number): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(`/api/order-items/order/${orderId}`);
  }
}
