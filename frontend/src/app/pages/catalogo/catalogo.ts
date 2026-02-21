import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CategoryService, Category } from '../../services/category.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo implements OnInit {
  activeFilter = 'all';
  lightboxItem: Product | null = null;
  products: Product[] = [];
  categories: Category[] = [];
  loading = true;

  // Número de WhatsApp del negocio
  private readonly whatsapp = '573114582898';

  constructor(
    private productSvc: ProductService,
    private categorySvc: CategoryService,
  ) {}

  ngOnInit(): void {
    // Cargar productos activos desde la API
    this.productSvc.getAll().subscribe({
      next: (res) => {
        this.products = res.data as Product[];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });

    // Cargar categorías para los filtros
    this.categorySvc.getAll().subscribe({
      next: (res) => {
        this.categories = res.data as Category[];
      },
    });
  }

  get filteredItems(): Product[] {
    if (this.activeFilter === 'all') return this.products;
    return this.products.filter((p) => {
      const cat = p.category;
      if (typeof cat === 'object') return cat.slug === this.activeFilter;
      return cat === this.activeFilter;
    });
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
  }

  openLightbox(item: Product) {
    this.lightboxItem = item;
  }

  closeLightbox() {
    this.lightboxItem = null;
  }

  // Obtener URL de imagen (soporta Cloudinary URLs y rutas relativas viejas)
  getImageUrl(product: Product): string {
    if (!product.image) return 'assets/img/placeholder.jpg';
    if (product.image.startsWith('http')) return product.image;
    return `https://floresbydolly.onrender.com${product.image}`;
  }

  // Obtener nombre de categoría
  getCategoryName(product: Product): string {
    if (typeof product.category === 'object') return product.category.name;
    return '';
  }

  // Generar URL de WhatsApp para consultar producto
  getWhatsappUrl(product: Product): string {
    const msg =
      product.whatsappMsg || `Hola! Me interesa ${product.name}. ¿Qué disponibilidad tienen?`;
    return `https://wa.me/${this.whatsapp}?text=${encodeURIComponent(msg)}`;
  }

  // Generar URL de WhatsApp para ordenar
  getOrderUrl(product: Product): string {
    const msg = `Hola! Quiero hacer un pedido de ${product.name}. ¿Cuál es el precio y disponibilidad?`;
    return `https://wa.me/${this.whatsapp}?text=${encodeURIComponent(msg)}`;
  }
}
