import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLogin {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {
    if (auth.isLoggedIn()) {
      router.navigate(['/admin']);
    }
  }

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.error = 'Ingresa usuario y contraseña';
      return;
    }

    this.loading = true;
    this.error = '';

    this.auth.login(this.username, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.router.navigate(['/admin']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Error al iniciar sesión';
      },
    });
  }
}
