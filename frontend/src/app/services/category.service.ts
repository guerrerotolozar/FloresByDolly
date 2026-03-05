import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  order: number;
  isActive: boolean;
  showOnHome: boolean;
  description: string;
  image: string;
  color: string;
}

interface CategoryResponse {
  success: boolean;
  count?: number;
  data: Category | Category[];
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly API = 'https://floresbydolly.onrender.com/api/categories';

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  private headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  getAll(showAll = false): Observable<CategoryResponse> {
    const url = showAll ? `${this.API}?showAll=true` : this.API;
    return this.http.get<CategoryResponse>(url);
  }

  create(category: Partial<Category>): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(this.API, category, { headers: this.headers() });
  }

  update(id: string, category: Partial<Category>): Observable<CategoryResponse> {
    return this.http.put<CategoryResponse>(`${this.API}/${id}`, category, {
      headers: this.headers(),
    });
  }

  delete(id: string): Observable<CategoryResponse> {
    return this.http.delete<CategoryResponse>(`${this.API}/${id}`, { headers: this.headers() });
  }
}
