import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { type Observable, forkJoin, map, of, catchError } from 'rxjs';
import type { Product } from './product-entity';
import type { User } from './user.service';
import type { System } from './system.service';
import type { Supplier } from './supplier.service';
import type { PagedResult } from '../paging/page-result';

export type SearchResultType = 'user' | 'product' | 'system' | 'supplier';

export interface SearchResult {
  id: number;
  name: string;
  description: string | null;
  type: SearchResultType;
  route: string;
  icon: string;
}

export interface GroupedSearchResults {
  users: SearchResult[];
  products: SearchResult[];
  systems: SearchResult[];
  suppliers: SearchResult[];
}

@Injectable({ providedIn: 'root' })
export class GlobalSearchService {
  private readonly http = inject(HttpClient);

  search(query: string): Observable<GroupedSearchResults> {
    if (!query || query.trim().length < 2) {
      return of({
        users: [],
        products: [],
        systems: [],
        suppliers: []
      });
    }

    const lowerQuery = query.toLowerCase();

    return forkJoin({
      users: this.http.get<PagedResult<User>>('/api/users?page=1&pageSize=100').pipe(
        map(result => this.filterUsers(result.data, lowerQuery)),
        catchError(() => of([]))
      ),
      products: this.http.get<PagedResult<Product>>('/api/products?page=1&pageSize=100').pipe(
        map(result => this.filterProducts(result.data, lowerQuery)),
        catchError(() => of([]))
      ),
      systems: this.http.get<PagedResult<System>>('/api/systems?page=1&pageSize=100').pipe(
        map(result => this.filterSystems(result.data, lowerQuery)),
        catchError(() => of([]))
      ),
      suppliers: this.http.get<Supplier[]>('/api/suppliers').pipe(
        map(suppliers => this.filterSuppliers(suppliers, lowerQuery)),
        catchError(() => of([]))
      )
    });
  }

  private filterUsers(users: User[], query: string): SearchResult[] {
    return users
      .filter(user =>
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.username?.toLowerCase().includes(query)
      )
      .slice(0, 5)
      .map(user => ({
        id: user.id,
        name: user.name,
        description: user.email,
        type: 'user' as SearchResultType,
        route: `/users/${user.id}`,
        icon: 'bi-person'
      }));
  }

  private filterProducts(products: Product[], query: string): SearchResult[] {
    return products
      .filter(product =>
        product.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      )
      .slice(0, 5)
      .map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        type: 'product' as SearchResultType,
        route: `/products/${product.id}`,
        icon: 'bi-box'
      }));
  }

  private filterSystems(systems: System[], query: string): SearchResult[] {
    return systems
      .filter(system =>
        system.name?.toLowerCase().includes(query) ||
        system.description?.toLowerCase().includes(query)
      )
      .slice(0, 5)
      .map(system => ({
        id: system.id,
        name: system.name,
        description: system.description,
        type: 'system' as SearchResultType,
        route: `/systems/${system.id}`,
        icon: 'bi-gear'
      }));
  }

  private filterSuppliers(suppliers: Supplier[], query: string): SearchResult[] {
    return suppliers
      .filter(supplier =>
        supplier.name?.toLowerCase().includes(query) ||
        supplier.email?.toLowerCase().includes(query)
      )
      .slice(0, 5)
      .map(supplier => ({
        id: supplier.id,
        name: supplier.name,
        description: supplier.email,
        type: 'supplier' as SearchResultType,
        route: `/suppliers/${supplier.id}/edit`,
        icon: 'bi-truck'
      }));
  }
}
