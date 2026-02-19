import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

interface UploadResponse {
  success: boolean;
  data: { filename: string; url: string; size: number };
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly API = 'http://localhost:3000/api/upload';

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  private headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  upload(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<UploadResponse>(this.API, formData, { headers: this.headers() });
  }

  delete(filename: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.API}/${filename}`, {
      headers: this.headers(),
    });
  }
}
