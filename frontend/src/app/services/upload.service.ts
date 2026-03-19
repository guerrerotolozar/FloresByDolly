import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface UploadResponse {
  success: boolean;
  data: { filename: string; url: string; size: number };
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly API = `${environment.apiUrl}/upload`;

  constructor(private http: HttpClient) {}

  // El auth interceptor agrega el token automáticamente.
  // NO poner Content-Type manual — el navegador lo pone solo para FormData (multipart/form-data)
  upload(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<UploadResponse>(this.API, formData);
  }

  delete(filename: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.API}/${filename}`);
  }
}
