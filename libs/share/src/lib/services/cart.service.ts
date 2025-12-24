import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

export interface CartItem {
  id: number;
  user_id: number | null;
  product_id: number | null;
  quantity: number;
  added_at: Date;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/shopping-cart-items';

  private readonly itemsSignal = signal<CartItem[]>([]);

  readonly items = this.itemsSignal.asReadonly();
  readonly itemCount = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + item.quantity, 0)
  );

  loadCart() {
    return this.http.get<CartItem[]>(this.baseUrl).pipe(
      tap((items) => this.itemsSignal.set(items))
    );
  }

  addItem(productId: number, quantity: number = 1) {
    return this.http
      .post<CartItem>(this.baseUrl, { product_id: productId, quantity })
      .pipe(tap(() => this.loadCart().subscribe()));
  }

  updateQuantity(itemId: number, quantity: number) {
    return this.http
      .put<CartItem>(`${this.baseUrl}/${itemId}`, { quantity })
      .pipe(tap(() => this.loadCart().subscribe()));
  }

  removeItem(itemId: number) {
    return this.http
      .delete<void>(`${this.baseUrl}/${itemId}`)
      .pipe(tap(() => this.loadCart().subscribe()));
  }

  clearCart() {
    this.itemsSignal.set([]);
  }
}