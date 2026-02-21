import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GalleryService, GalleryItem } from '../../services/gallery.service';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './galeria.html',
  styleUrl: './galeria.css',
})
export class Galeria implements OnInit {
  activeFilter = 'all';
  lightboxItem: GalleryItem | null = null;
  items: GalleryItem[] = [];
  loading = true;

  // Categorías con conteo dinámico
  categories = [
    { value: 'local', label: 'Nuestro Local', icon: 'fas fa-store' },
    { value: 'productos', label: 'Productos', icon: 'fas fa-seedling' },
    { value: 'arreglos', label: 'Arreglos Especiales', icon: 'fas fa-gift' },
    { value: 'bodas', label: 'Bodas', icon: 'fas fa-heart' },
  ];

  constructor(private gallerySvc: GalleryService) {}

  ngOnInit(): void {
    this.gallerySvc.getAll().subscribe({
      next: (res) => {
        this.items = res.data as GalleryItem[];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  get filteredItems(): GalleryItem[] {
    if (this.activeFilter === 'all') return this.items;
    return this.items.filter((i) => i.category === this.activeFilter);
  }

  getCategoryCount(category: string): number {
    return this.items.filter((i) => i.category === category).length;
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

  getImageUrl(image: string): string {
    if (!image) return 'assets/img/placeholder.jpg';
    if (image.startsWith('http')) return image;
    return `https://floresbydolly.onrender.com${image}`;
  }
}
