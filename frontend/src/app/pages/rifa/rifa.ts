import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-rifa',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './rifa.html',
  styleUrl: './rifa.css',
})
export class Rifa {
  formData = {
    nombre: '',
    celular: '',
  };

  // Obligamos a tener 1 referido por defecto
  referidos: { nombre: string; celular: string }[] = [{ nombre: '', celular: '' }];
  isSubmitting = false;

  constructor(private http: HttpClient) {}

  agregarReferido() {
    this.referidos.push({ nombre: '', celular: '' });
  }

  eliminarReferido(index: number) {
    if (this.referidos.length > 1) {
      this.referidos.splice(index, 1);
    }
  }

  get isFormValid(): boolean {
    const celular = (this.formData.celular ?? '').trim();
    const isCelularValid = celular.length === 10 && /^\d{10}$/.test(celular);
    const isNombreValid = (this.formData.nombre ?? '').trim().length > 0;

    // Al menos 1 referido debe estar lleno y válido
    const hasValidReferral = this.referidos.some(
      r => (r.nombre ?? '').trim().length > 0 && r.celular?.trim().length === 10 && /^\d{10}$/.test(r.celular)
    );

    return isNombreValid && isCelularValid && hasValidReferral;
  }

  onSubmit() {
    if (!this.isFormValid) return;
    this.isSubmitting = true;

    const numeroMama = '573114582898'; // Número de WhatsApp de la mamá

    let texto = `¡Hola Dolly! Aquí envío mis datos para participar en la rifa. Mi nombre es *${this.formData.nombre.trim()}* y mi número es *${this.formData.celular.trim()}*.`;

    const referidosValidos = this.referidos.filter(r => r.nombre.trim() && r.celular.trim());
    if (referidosValidos.length > 0) {
      texto += `\n\nMis referidos para el 20% de descuento son:`;
      referidosValidos.forEach((r, index) => {
        texto += `\n${index + 1}. Nombre: ${r.nombre.trim()} - Celular: ${r.celular.trim()}`;
      });
    }

    texto += `\n\n¡Confirmo mi registro! 🎟️`;

    const mensajeCodificado = encodeURIComponent(texto);
    const urlWa = `https://wa.me/${numeroMama}?text=${mensajeCodificado}`;

    const datosCompletos = {
      ...this.formData,
      referidos: referidosValidos
    };

    this.http.post('http://localhost:3000/api/registro', datosCompletos).subscribe({
      next: () => {
        window.location.href = urlWa;
      },
      error: (err) => {
        console.warn('Backend no disponible, procediendo al envío de WhatsApp.', err);
        window.location.href = urlWa;
        this.isSubmitting = false;
      }
    });
  }
}
