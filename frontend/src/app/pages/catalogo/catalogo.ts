import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface ProductItem {
  img: string;
  name: string;
  description: string;
  category: string;
  price: string;
  badgeClass: string;
  badgeLabel: string;
  features: string[];
  tags: string[];
  consultUrl: string;
  orderUrl: string;
  orderLabel: string;
}

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo {
  activeFilter = 'all';
  lightboxItem: ProductItem | null = null;

  items: ProductItem[] = [
    {
      img: 'assets/img/ramo_azul_mini.jpg',
      name: 'Astromelias',
      description:
        'Nuestras flores más populares. Colores vibrantes que duran hasta 2 semanas. Perfectas para alegrar cualquier espacio.',
      category: 'sencillas',
      price: 'Variable',
      badgeClass: 'bg-success',
      badgeLabel: 'Más Vendida',
      features: [
        'Duración: 10-14 días',
        'Colores: Azul, Rosa, Blanco, Amarillo',
        'Presentación: Ramillete o por unidad',
      ],
      tags: ['Duraderas', 'Coloridas', 'Populares'],
      consultUrl:
        'https://wa.me/573114582898?text=Hola! Me interesan las Astromelias. ¿Qué colores tienen disponibles hoy?',
      orderUrl:
        'https://wa.me/573114582898?text=Hola! Quiero información sobre Astromelias: precios, colores disponibles y presentaciones',
      orderLabel: 'Hacer Pedido',
    },
    {
      img: 'assets/img/ramo.jpg',
      name: 'Margaritas',
      description:
        'Simbolizan pureza y nuevos comienzos. Ideales para ocasiones especiales y decoración del hogar.',
      category: 'sencillas',
      price: 'Variable',
      badgeClass: 'bg-warning text-dark',
      badgeLabel: 'Elegantes',
      features: [
        'Duración: 7-10 días',
        'Colores: Blanco, Rosa, Amarillo',
        'Significado: Pureza, inocencia',
      ],
      tags: ['Pureza', 'Elegantes', 'Clásicas'],
      consultUrl: 'https://wa.me/573114582898?text=Hola! Quiero información sobre Margaritas',
      orderUrl:
        'https://wa.me/573114582898?text=Hola! Me interesan las Margaritas. ¿Tienen disponibles y en qué colores?',
      orderLabel: 'Hacer Pedido',
    },
    {
      img: 'assets/img/rosa_mini.jpg',
      name: 'Girasoles',
      description:
        'Luz y energía positiva. Transmiten alegría y optimismo en cada pétalo. Perfectos para levantar el ánimo.',
      category: 'temporada',
      price: 'Variable',
      badgeClass: 'bg-info',
      badgeLabel: 'De Temporada',
      features: [
        'Duración: 5-8 días',
        'Temporada: Disponibilidad variable',
        'Significado: Alegría, energía positiva',
      ],
      tags: ['Alegría', 'Energía', 'Temporada'],
      consultUrl:
        'https://wa.me/573114582898?text=Hola! Me encantan los Girasoles. ¿Están en temporada?',
      orderUrl:
        'https://wa.me/573114582898?text=Hola! Me interesan los Girasoles. ¿Están disponibles en esta temporada?',
      orderLabel: 'Consultar Disponibilidad',
    },
    {
      img: 'assets/img/ramo_rosa_02.jpg',
      name: 'Rosas Clásicas',
      description:
        'El símbolo eterno del amor. Disponibles en múltiples colores y arreglos. Perfectas para expresar sentimientos profundos.',
      category: 'rosas',
      price: 'Variable',
      badgeClass: 'bg-danger',
      badgeLabel: 'Amor Eterno',
      features: [
        'Duración: 5-7 días',
        'Colores: Rojo, Rosa, Blanco, Amarillo',
        'Presentación: Unidad, docena, ramillete',
      ],
      tags: ['Amor', 'Románticas', 'Clásicas'],
      consultUrl: 'https://wa.me/573114582898?text=Hola! Quiero ver las Rosas disponibles',
      orderUrl:
        'https://wa.me/573114582898?text=Hola! Me interesan las Rosas. ¿Qué colores y presentaciones tienen disponibles?',
      orderLabel: 'Ver Rosas Disponibles',
    },
    {
      img: 'assets/img/ramo_boda_cencillo.jpg',
      name: 'Ramos de Novia',
      description:
        'Elegancia y sencillez para el día más especial. Diseños clásicos y atemporales personalizados para cada novia.',
      category: 'especiales',
      price: 'Cotizar',
      badgeClass: 'bg-light text-dark',
      badgeLabel: 'Día Especial',
      features: ['Diseño personalizado', 'Flores frescas del día', 'Colores según vestido'],
      tags: ['Bodas', 'Personalizado', 'Elegante'],
      consultUrl: 'https://wa.me/573114582898?text=Hola! Me interesa un ramo de novia',
      orderUrl:
        'https://wa.me/573114582898?text=Hola! Necesito un ramo de novia. Mi boda es el [fecha]. ¿Podemos coordinar una cita?',
      orderLabel: 'Cotizar Ramo',
    },
    {
      img: 'assets/img/ramos_03.jpg',
      name: 'Arreglos Personalizados',
      description:
        'Combinaciones únicas según tu gusto. Cada ramo cuenta una historia diferente y se adapta a la ocasión especial.',
      category: 'especiales',
      price: 'Cotizar',
      badgeClass: 'bg-secondary',
      badgeLabel: 'Único',
      features: ['100% personalizable', 'Flores según ocasión', 'Empaque especial incluido'],
      tags: ['Personalizado', 'Único', 'Especial'],
      consultUrl: 'https://wa.me/573114582898?text=Hola! Quiero un arreglo personalizado',
      orderUrl:
        'https://wa.me/573114582898?text=Hola! Quiero un arreglo personalizado. La ocasión es: [describe tu evento/ocasión]',
      orderLabel: 'Diseñar Arreglo',
    },
  ];

  get filteredItems(): ProductItem[] {
    if (this.activeFilter === 'all') return this.items;
    return this.items.filter((i) => i.category === this.activeFilter);
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
  }

  openLightbox(item: ProductItem) {
    this.lightboxItem = item;
  }

  closeLightbox() {
    this.lightboxItem = null;
  }
}
