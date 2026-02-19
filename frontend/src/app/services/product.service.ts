import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: string;
  category: { _id: string; name: string; slug: string; icon: string } | string;
  image: string;
  badgeLabel: string;
  badgeClass: string;
  features: string[];
  tags: string[];
  whatsappMsg: string;
  isActive: boolean;
  order: number;
}

interface ProductResponse {
  success: boolean;
  count?: number;
  data: Product | Product[];
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly API = 'http://localhost:3000/api/products';

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  private headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  getAll(showAll = false): Observable<ProductResponse> {
    const url = showAll ? `${this.API}?showAll=true` : this.API;
    return this.http.get<ProductResponse>(url);
  }

  getById(id: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.API}/${id}`);
  }

  create(product: Partial<Product>): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(this.API, product, { headers: this.headers() });
  }

  update(id: string, product: Partial<Product>): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.API}/${id}`, product, {
      headers: this.headers(),
    });
  }

  delete(id: string): Observable<ProductResponse> {
    return this.http.delete<ProductResponse>(`${this.API}/${id}`, { headers: this.headers() });
  }
}
