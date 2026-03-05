import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface GalleryItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  isActive: boolean;
  order: number;
}

interface GalleryResponse {
  success: boolean;
  count?: number;
  data: GalleryItem | GalleryItem[];
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class GalleryService {
  private readonly API = `${environment.apiUrl}/gallery`;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  private headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  getAll(showAll = false): Observable<GalleryResponse> {
    const url = showAll ? `${this.API}?showAll=true` : this.API;
    return this.http.get<GalleryResponse>(url);
  }

  getById(id: string): Observable<GalleryResponse> {
    return this.http.get<GalleryResponse>(`${this.API}/${id}`);
  }

  create(item: Partial<GalleryItem>): Observable<GalleryResponse> {
    return this.http.post<GalleryResponse>(this.API, item, { headers: this.headers() });
  }

  update(id: string, item: Partial<GalleryItem>): Observable<GalleryResponse> {
    return this.http.put<GalleryResponse>(`${this.API}/${id}`, item, { headers: this.headers() });
  }

  delete(id: string): Observable<GalleryResponse> {
    return this.http.delete<GalleryResponse>(`${this.API}/${id}`, { headers: this.headers() });
  }
}
