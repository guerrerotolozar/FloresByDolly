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
      descripcion: 'Un ramo romántico que habla por ti. Rosas y astromelias en armonía perfecta para esa persona especial.',
      imagen: 'https://placehold.co/1080x1080/f8fffe/13592a?text=🌹+Amor+que+se+nota',
      badge: 'Romántico',
      badgeClass: 'badge-romantico',
    },
    {
      nombre: 'Sorpresa Especial',
      descripcion: 'Un detalle inesperado que ilumina cualquier día. Girasoles y margaritas llenas de alegría.',
      imagen: 'https://placehold.co/1080x1080/fffbeb/92400e?text=🌻+Sorpresa+Especial',
      badge: 'Popular',
      badgeClass: 'badge-popular',
    },
    {
      nombre: 'Elegancia Natural',
      descripcion: 'Sofisticación con estilo único. Lirios y follaje premium para ambientes con clase.',
      imagen: 'https://placehold.co/1080x1080/f0fdf4/166534?text=🌿+Elegancia+Natural',
      badge: 'Premium',
      badgeClass: 'badge-premium',
    },
    {
      nombre: 'Dulce Amanecer',
      descripcion: 'Colores suaves y delicados que evocan frescura. Ideal para sorprender al despertar.',
      imagen: 'https://placehold.co/1080x1080/fff1f2/9f1239?text=🌸+Dulce+Amanecer',
      badge: 'Delicado',
      badgeClass: 'badge-delicado',
    },
    {
      nombre: 'Jardín Encantado',
      descripcion: 'Una explosión de color y vida. Variedad de flores campestres que traen la magia del campo.',
      imagen: 'https://placehold.co/1080x1080/fefce8/854d0e?text=💐+Jardín+Encantado',
      badge: 'Variedad',
      badgeClass: 'badge-variedad',
    },
    {
      nombre: 'Brillo Eterno',
      descripcion: 'Rosas preservadas que duran meses. El regalo perfecto para quien merece lo mejor.',
      imagen: 'https://placehold.co/1080x1080/faf5ff/7e22ce?text=✨+Brillo+Eterno',
      badge: 'Exclusivo',
      badgeClass: 'badge-exclusivo',
    },
  ];

  goToCatalog(): void {
    this.router.navigate(['/catalogo']);
  }
}

