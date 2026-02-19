import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, map } from 'rxjs';

interface LoginResponse {
  success: boolean;
  token: string;
  user: { _id: string; username: string; displayName: string; role: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:3000/api/auth';
  private currentUser = signal<LoginResponse['user'] | null>(null);

  isLoggedIn = computed(() => !!this.currentUser() && !!this.getToken());
  user = computed(() => this.currentUser());

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    // Restaurar usuario del localStorage
    const stored = localStorage.getItem('flores_user');
    if (stored && this.getToken()) {
      this.currentUser.set(JSON.parse(stored));
    }
  }

  getToken(): string | null {
    return localStorage.getItem('flores_token');
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API}/login`, { username, password }).pipe(
      tap((res) => {
        if (res.success) {
          localStorage.setItem('flores_token', res.token);
          localStorage.setItem('flores_user', JSON.stringify(res.user));
          this.currentUser.set(res.user);
        }
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('flores_token');
    localStorage.removeItem('flores_user');
    this.currentUser.set(null);
    this.router.navigate(['/admin/login']);
  }

  /** Verificar token con el backend */
  checkAuth(): Observable<boolean> {
    const token = this.getToken();
    if (!token) return of(false);

    return this.http
      .get<{ success: boolean; user: LoginResponse['user'] }>(`${this.API}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        map((res) => {
          if (res.success) this.currentUser.set(res.user);
          return res.success;
        }),
        catchError(() => {
          this.logout();
          return of(false);
        }),
      );
  }
}
