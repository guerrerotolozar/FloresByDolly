import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Arreglo {
  nombre: string;
  descripcion: string;
  imagen: string;
  badge: string;
  badgeClass: string;
}

@Component({
  selector: 'app-special-arrangements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './special-arrangements.html',
  styleUrl: './special-arrangements.css',
})
export class SpecialArrangements {
  constructor(private router: Router) {}

  arreglos: Arreglo[] = [
    {
      nombre: 'Amor que se nota',
      descripcion:
        'Un ramo romántico que habla por ti. Rosas y lavanda en armonía perfecta para esa persona especial.',
      imagen: 'assets/img/rosas_y_lavanda.jpg',
      badge: 'Romántico',
      badgeClass: 'badge-romantico',
    },
    {
      nombre: 'Sorpresa Especial',
      descripcion:
        'Un detalle inesperado que ilumina cualquier día. Girasoles y margaritas llenas de alegría.',
      imagen: 'assets/img/sorpresa_especial.jpg',
      badge: 'Popular',
      badgeClass: 'badge-popular',
    },
    {
      nombre: 'Elegancia Natural',
      descripcion:
        'Sofisticación con estilo único. Lirios y follaje premium para ambientes con clase.',
      imagen: 'assets/img/rosas_y_lirios.jpg',
      badge: 'Premium',
      badgeClass: 'badge-premium',
    },
    {
      nombre: 'Dulce Amanecer',
      descripcion:
        'Colores suaves y delicados que evocan frescura. Ideal para sorprender al despertar.',
      imagen: 'assets/img/dulce_amanecer.jpg',
      badge: 'Delicado',
      badgeClass: 'badge-delicado',
    },
    {
      nombre: 'Jardín Encantado',
      descripcion:
        'Una explosión de color y vida. Variedad de flores campestres que traen la magia del campo.',
      imagen: 'assets/img/jardin_encantado.jpg',
      badge: 'Variedad',
      badgeClass: 'badge-variedad',
    },
    {
      nombre: 'Brillo Eterno',
      descripcion:
        'Rosas preservadas que duran meses. El regalo perfecto para quien merece lo mejor.',
      imagen: 'assets/img/rosas_preservadas.jpg',
      badge: 'Exclusivo',
      badgeClass: 'badge-exclusivo',
    },
  ];

  goToCatalog(): void {
    this.router.navigate(['/catalogo']);
  }
}
