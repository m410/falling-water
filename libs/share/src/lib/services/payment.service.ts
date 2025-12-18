import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Payment {
  id: number;
  order_id: number | null;
  payment_method: string;
  amount: number;
  status: string;
  paid_at: Date | null;
  created_at: Date;
}

export interface PaymentSum {
  sum: number;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/payments';

  sumLastMonth(): Observable<PaymentSum> {
    return this.http.get<PaymentSum>(`${this.baseUrl}/sum-last-month`);
  }
}
