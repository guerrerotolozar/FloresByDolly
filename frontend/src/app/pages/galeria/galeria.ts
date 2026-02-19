import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface GalleryItem {
  img: string;
  title: string;
  description: string;
  category: string;
  badgeClass: string;
  badgeLabel: string;
  tags?: string[];
}

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './galeria.html',
  styleUrl: './galeria.css',
})
export class Galeria {
  activeFilter = 'all';
  lightboxItem: GalleryItem | null = null;

  items: GalleryItem[] = [
    {
      img: 'assets/img/galeria/local/local-flores-2.jpg',
      title: 'Vista Exterior',
      description: 'Fácil acceso en el corazón de Villa Alsacia',
      category: 'local',
      badgeClass: 'bg-success',
      badgeLabel: 'Nuestro Local',
    },
    {
      img: 'assets/img/galeria/local/local-flores.jpg',
      title: 'Nuestro Local Principal',
      description: 'Vista interior de nuestro acogedor espacio en Carnova Premium',
      category: 'local',
      badgeClass: 'bg-success',
      badgeLabel: 'Nuestro Local',
    },
    {
      img: 'assets/img/galeria/local/slide1.jpg',
      title: 'Nuestro Espacio',
      description: 'Ambiente cálido donde seleccionamos las mejores flores',
      category: 'local',
      badgeClass: 'bg-success',
      badgeLabel: 'Nuestro Local',
    },
    {
      img: 'assets/img/galeria/productos/ramo-productos-1.jpg',
      title: 'Ramo Premium',
      description: 'Selección especial de nuestras mejores flores',
      category: 'productos',
      badgeClass: 'bg-primary',
      badgeLabel: 'Productos',
      tags: ['premium', 'especial', 'calidad'],
    },
    {
      img: 'assets/img/galeria/productos/ramo-productos-2.jpg',
      title: 'Astromelias Premium',
      description: 'Tonos exclusivos y colores únicos',
      category: 'productos',
      badgeClass: 'bg-primary',
      badgeLabel: 'Productos',
      tags: ['astromelias', 'premium', 'exclusivo'],
    },
    {
      img: 'assets/img/galeria/productos/ramo.jpg',
      title: 'Ramo Mixto',
      description: 'Combinación perfecta de colores y texturas',
      category: 'productos',
      badgeClass: 'bg-primary',
      badgeLabel: 'Productos',
      tags: ['mixto', 'colores', 'variedad'],
    },
    {
      img: 'assets/img/galeria/productos/ramo_azul_mini.jpg',
      title: 'Astromelias Azules',
      description: 'Nuestras flores más vendidas en tonos vibrantes',
      category: 'productos',
      badgeClass: 'bg-primary',
      badgeLabel: 'Productos',
      tags: ['astromelias', 'azul', 'popular'],
    },
    {
      img: 'assets/img/galeria/productos/rosa_mini.jpg',
      title: 'Rosas Miniatura',
      description: 'Delicadas rosas perfectas para cualquier ocasión',
      category: 'productos',
      badgeClass: 'bg-primary',
      badgeLabel: 'Productos',
      tags: ['rosas', 'miniatura', 'amor'],
    },
    {
      img: 'assets/img/galeria/arreglos/ramo_rosa_02.jpg',
      title: 'Ramo Rosa Especial',
      description: 'Tonos románticos para momentos especiales',
      category: 'arreglos',
      badgeClass: 'bg-warning text-dark',
      badgeLabel: 'Arreglos Especiales',
      tags: ['rosa', 'romántico', 'especial'],
    },
    {
      img: 'assets/img/galeria/arreglos/ramos_03.jpg',
      title: 'Ramos Personalizados',
      description: 'Cada ramo cuenta una historia única',
      category: 'arreglos',
      badgeClass: 'bg-warning text-dark',
      badgeLabel: 'Arreglos Especiales',
      tags: ['personalizado', 'único', 'especial'],
    },
    {
      img: 'assets/img/galeria/bodas/ramo_boda_cencillo.jpg',
      title: 'Ramo de Novia Clásico',
      description: 'Elegancia y sencillez para tu día perfecto',
      category: 'bodas',
      badgeClass: 'bg-danger',
      badgeLabel: 'Bodas',
      tags: ['novia', 'boda', 'clásico', 'elegante'],
    },
    {
      img: 'assets/img/galeria/bodas/ramo_boda_cencillo_02.jpg',
      title: 'Ramo Delicado',
      description: 'Toques sutiles para ceremonias íntimas',
      category: 'bodas',
      badgeClass: 'bg-danger',
      badgeLabel: 'Bodas',
      tags: ['delicado', 'íntimo', 'sutil'],
    },
  ];

  get filteredItems(): GalleryItem[] {
    if (this.activeFilter === 'all') return this.items;
    return this.items.filter((i) => i.category === this.activeFilter);
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
  }

  openLightbox(item: GalleryItem) {
    this.lightboxItem = item;
  }

  closeLightbox() {
    this.lightboxItem = null;
  }
}
